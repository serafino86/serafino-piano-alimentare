// POST /api/ricetta
// Body: { proteina, fecola, grasso, tipo: 'pranzo'|'cena', profilo: {nome, peso_kg},
//         fase: 'dimagrimento'|'mantenimento'|'massa', stagione?: string }
// Returns: { ricetta: Ricetta, fromCache: boolean }

import { NextRequest, NextResponse } from 'next/server';
import { generaRicetta, Ricetta } from '@/lib/groq';
import { SYSTEM_PROMPT_DOTTORESSA } from '@/lib/prompt-generator';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL ?? '';
const TIMEOUT_SHEETS  = 15000;

// ─────────────────────────────────────────
// Helpers cache su Sheets
// ─────────────────────────────────────────

function buildCacheKey(proteina: string, fecola: string, grasso: string): string {
  const normalizza = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  return `${normalizza(proteina)}__${normalizza(fecola)}__${normalizza(grasso)}`;
}

async function getRicettaCache(chiave: string): Promise<Ricetta | null> {
  if (!APPS_SCRIPT_URL) return null;
  try {
    const url = `${APPS_SCRIPT_URL}?action=getRicettaCache&chiave=${encodeURIComponent(chiave)}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_SHEETS),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error || !data?.ricetta) return null;
    return data.ricetta as Ricetta;
  } catch {
    return null;
  }
}

async function saveRicettaCache(chiave: string, ricetta: Ricetta): Promise<void> {
  if (!APPS_SCRIPT_URL) return;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveRicettaCache', chiave, ricetta }),
      signal: AbortSignal.timeout(TIMEOUT_SHEETS),
    });
  } catch {
    // Non critico: la ricetta è già stata generata, il salvataggio fallisce in silenzio
  }
}

// ─────────────────────────────────────────
// Validazione body
// ─────────────────────────────────────────

interface RequestBody {
  proteina: string;
  fecola: string;
  grasso: string;
  tipo: 'pranzo' | 'cena';
  profilo: { nome: string; peso_kg: number };
  fase: 'dimagrimento' | 'mantenimento' | 'massa';
  stagione?: string;
}

function validateBody(body: unknown): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Body mancante o non è un oggetto JSON' };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.proteina !== 'string' || !b.proteina.trim()) {
    return { valid: false, error: 'Campo "proteina" obbligatorio (stringa)' };
  }
  if (typeof b.fecola !== 'string' || !b.fecola.trim()) {
    return { valid: false, error: 'Campo "fecola" obbligatorio (stringa)' };
  }
  if (typeof b.grasso !== 'string' || !b.grasso.trim()) {
    return { valid: false, error: 'Campo "grasso" obbligatorio (stringa)' };
  }
  if (b.tipo !== 'pranzo' && b.tipo !== 'cena') {
    return { valid: false, error: 'Campo "tipo" deve essere "pranzo" o "cena"' };
  }
  if (!b.profilo || typeof b.profilo !== 'object') {
    return { valid: false, error: 'Campo "profilo" obbligatorio (oggetto)' };
  }
  const profilo = b.profilo as Record<string, unknown>;
  if (typeof profilo.nome !== 'string' || !profilo.nome.trim()) {
    return { valid: false, error: 'Campo "profilo.nome" obbligatorio (stringa)' };
  }
  if (typeof profilo.peso_kg !== 'number' || profilo.peso_kg <= 0) {
    return { valid: false, error: 'Campo "profilo.peso_kg" obbligatorio (numero > 0)' };
  }
  const fasiValide = ['dimagrimento', 'mantenimento', 'massa'];
  if (!fasiValide.includes(b.fase as string)) {
    return { valid: false, error: `Campo "fase" deve essere uno di: ${fasiValide.join(', ')}` };
  }

  return {
    valid: true,
    data: {
      proteina: b.proteina.trim(),
      fecola:   b.fecola.trim(),
      grasso:   b.grasso.trim(),
      tipo:     b.tipo,
      profilo:  { nome: (profilo.nome as string).trim(), peso_kg: profilo.peso_kg as number },
      fase:     b.fase as 'dimagrimento' | 'mantenimento' | 'massa',
      stagione: typeof b.stagione === 'string' ? b.stagione.trim() : undefined,
    },
  };
}

// ─────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Body non è JSON valido' },
      { status: 400 },
    );
  }

  const validation = validateBody(rawBody);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 },
    );
  }

  const { proteina, fecola, grasso, tipo, profilo, fase, stagione } = validation.data;
  const chiave = buildCacheKey(proteina, fecola, grasso);

  // 1. Cerca in cache su Sheets
  const cached = await getRicettaCache(chiave);
  if (cached) {
    return NextResponse.json({ ricetta: cached, fromCache: true });
  }

  // 2. Genera tramite Groq
  let ricetta: Ricetta;
  try {
    ricetta = await generaRicetta({
      proteina,
      fecola,
      grasso,
      tipo,
      profilo,
      fase,
      stagione,
      systemPrompt: SYSTEM_PROMPT_DOTTORESSA,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[ricetta] Errore Groq:', msg);
    return NextResponse.json(
      { error: 'Impossibile generare la ricetta', detail: msg },
      { status: 502 },
    );
  }

  // 3. Salva in cache su Sheets (fire and forget)
  saveRicettaCache(chiave, ricetta).catch(e =>
    console.warn('[ricetta] Salvataggio cache fallito:', e),
  );

  return NextResponse.json({ ricetta, fromCache: false });
}

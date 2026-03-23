import { PianoMese } from './generator';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyCGNC4qa78C9XdB6ylXYnzcuSj2qGLVWkoMdJM19PkcTsjB8uk8ax7dehYQuTDUhOd/exec';

// ─────────────────────────────────────────
// Salva piano mensile su Sheets
// ─────────────────────────────────────────

export async function savePianoMensile(anno: number, mese: number, piano: PianoMese): Promise<void> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'savePianoMensile', anno, mese, piano }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`Sheets savePianoMensile error: ${res.status}`);
  }
}

// ─────────────────────────────────────────
// Legge piano mensile da Sheets
// ─────────────────────────────────────────

export async function getPianoMensile(anno: number, mese: number): Promise<PianoMese | null> {
  const url = `${APPS_SCRIPT_URL}?action=getPianoMensile&anno=${anno}&mese=${mese}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.error || typeof data !== 'object') return null;

    // Valida che sia un piano mensile (almeno un giorno con campo tipo valido)
    const TIPI_VALIDI = ['LMV', 'MT', 'SAB', 'DOM'];
    const entries = Object.values(data) as Array<{ tipo?: string }>;
    const valido = entries.length > 0 && entries.every(e => e.tipo && TIPI_VALIDI.includes(e.tipo));
    if (!valido) return null;

    return data as PianoMese;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────
// Salva eccezione giorno
// ─────────────────────────────────────────

export async function salvaEccezione(data: string, note: string): Promise<void> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'salvaEccezione', data, note }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Sheets salvaEccezione error: ${res.status}`);
  }
}

// ─────────────────────────────────────────
// Lista della spesa
// ─────────────────────────────────────────

export async function getListaSpesa(): Promise<Record<string, unknown> | null> {
  const url = `${APPS_SCRIPT_URL}?action=getSpesa`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.error) return null;

    return data;
  } catch {
    return null;
  }
}

export async function archiviaMese(anno: number, mese: number): Promise<void> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'archiviaMese', anno, mese }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Sheets archiviaMese error: ${res.status}`);
}

export async function saveListaSpesa(spesa: Record<string, unknown>): Promise<void> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'saveSpesa', spesa }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Sheets saveSpesa error: ${res.status}`);
  }
}

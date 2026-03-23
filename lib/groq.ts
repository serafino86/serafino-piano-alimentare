// ═══════════════════════════════════════════════════════
// Client Groq con retry e fallback
// Model: llama-3.3-70b-versatile
// ═══════════════════════════════════════════════════════

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

export interface Ricetta {
  nome: string;
  sottotitolo: string;
  ingredienti: {
    nome: string;
    quantita: string;
    note?: string;
  }[];
  preparazione: string[];
  tempo_prep: number;
  tempo_cottura: number;
  tecnica: 'vapore' | 'griglia' | 'forno' | 'crudo' | 'padella';
  consiglio_chef: string;
  variante_stagionale?: string;
  principio_nutrizionale: string;
}

export interface GeneraRicettaParams {
  proteina: string;
  fecola: string;
  grasso: string;
  tipo: 'pranzo' | 'cena';
  profilo: { nome: string; peso_kg: number };
  fase: 'dimagrimento' | 'mantenimento' | 'massa';
  stagione?: string;
  systemPrompt: string;
}

// ─────────────────────────────────────────
// Fetch con retry esponenziale
// ─────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetry = 3,
  delayMs = 800,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    try {
      const res = await fetch(url, options);
      // Ritorna subito anche su errori HTTP (gestiti dal chiamante)
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetry) {
        await new Promise(r => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────
// Genera ricetta tramite Groq
// ─────────────────────────────────────────

export async function generaRicetta(params: GeneraRicettaParams): Promise<Ricetta> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY non configurata');
  }

  const target_kcal = Math.round(params.profilo.peso_kg * 7.1);   // ~620 kcal/pasto per 87 kg
  const target_prot = Math.round(params.profilo.peso_kg * 0.61);  // ~53g prot/pasto per 87 kg

  const userMessage = `
Crea una ricetta italiana per ${params.tipo.toUpperCase()} con questi ingredienti:
- PROTEINA: ${params.proteina}
- FECOLA: ${params.fecola}
- GRASSO: ${params.grasso}

Profilo paziente: ${params.profilo.nome}, ${params.profilo.peso_kg} kg
Fase: ${params.fase}
Stagione: ${params.stagione ?? 'non specificata'}
Target pasto: circa ${target_kcal} kcal, ${target_prot}g proteine

Rispondi SOLO con JSON valido (nessun testo fuori dal JSON), seguendo esattamente questa struttura:
{
  "nome": "...",
  "sottotitolo": "...",
  "ingredienti": [
    { "nome": "...", "quantita": "...", "note": "..." }
  ],
  "preparazione": ["passo 1", "passo 2", "..."],
  "tempo_prep": 10,
  "tempo_cottura": 20,
  "tecnica": "vapore|griglia|forno|crudo|padella",
  "consiglio_chef": "...",
  "variante_stagionale": "...",
  "principio_nutrizionale": "..."
}
`.trim();

  const body = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: params.systemPrompt },
      { role: 'user',   content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1200,
    response_format: { type: 'json_object' },
  };

  const res = await fetchWithRetry(
    GROQ_API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    },
    3,
    800,
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq ha restituito una risposta vuota');
  }

  let ricetta: Ricetta;
  try {
    ricetta = JSON.parse(content) as Ricetta;
  } catch {
    throw new Error(`Impossibile parsare JSON Groq: ${content.slice(0, 200)}`);
  }

  // Validazione campi obbligatori
  const required: (keyof Ricetta)[] = [
    'nome', 'sottotitolo', 'ingredienti', 'preparazione',
    'tempo_prep', 'tempo_cottura', 'tecnica',
    'consiglio_chef', 'principio_nutrizionale',
  ];
  for (const field of required) {
    if (ricetta[field] === undefined || ricetta[field] === null) {
      throw new Error(`Campo obbligatorio mancante nella ricetta: ${field}`);
    }
  }

  return ricetta;
}

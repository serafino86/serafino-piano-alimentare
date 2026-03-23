import { NextRequest, NextResponse } from 'next/server';
import type { SpesaVoce } from '@/lib/generator';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyCGNC4qa78C9XdB6ylXYnzcuSj2qGLVWkoMdJM19PkcTsjB8uk8ax7dehYQuTDUhOd/exec';

// Formatta la spesa in testo leggibile per email
function formattaSpesaPerMail(
  spesa: Record<string, SpesaVoce>,
  labelSettimana: string
): string {
  // Raggruppa per categoria
  const gruppi: Record<string, { nome: string; qta: string }[]> = {};
  for (const [nome, voce] of Object.entries(spesa)) {
    const cat = voce.cat || 'Altro';
    if (!gruppi[cat]) gruppi[cat] = [];
    gruppi[cat].push({ nome, qta: voce.qta });
  }

  const CAT_ORDER = [
    'Pesce e carne', 'Uova', 'Latticini', 'Vegetale proteico',
    'Pasta e cereali', 'Legumi', 'Pane', 'Verdura e tuberi',
    'Verdura fresca', 'Frutta e verdura', 'Frutta', 'Frutta secca',
    'Condimenti', 'Semi e frutta secca', 'Latticini vegetali',
    'Cereali', 'Integratori',
  ];

  const cats = Object.keys(gruppi).sort((a, b) => {
    const ai = CAT_ORDER.indexOf(a);
    const bi = CAT_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const totaleVoci = Object.keys(spesa).length;
  const dataOggi = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  let testo = `LISTA DELLA SPESA — Piano Alimentare Emanuele\n`;
  testo += `${labelSettimana}\n`;
  testo += `Generata il ${dataOggi} · ${totaleVoci} articoli\n`;
  testo += `${'═'.repeat(50)}\n\n`;

  for (const cat of cats) {
    testo += `▶ ${cat.toUpperCase()}\n`;
    for (const { nome, qta } of gruppi[cat]) {
      testo += `  □ ${nome.padEnd(38)} ${qta}\n`;
    }
    testo += '\n';
  }

  testo += `${'─'.repeat(50)}\n`;
  testo += `Piano alimentare generato da Serafino\n`;

  return testo;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, spesa, labelSettimana } = body as {
      email: string;
      spesa: Record<string, SpesaVoce>;
      labelSettimana?: string;
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 });
    }
    if (!spesa || Object.keys(spesa).length === 0) {
      return NextResponse.json({ error: 'Lista spesa vuota' }, { status: 400 });
    }

    const label = labelSettimana || 'Tutto il mese';
    const corpo = formattaSpesaPerMail(spesa, label);
    const settimana = label;

    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'inviaMailSpesa', email, corpo, settimana }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      throw new Error(`Apps Script error: ${res.status}`);
    }

    const data = await res.json();
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, email, voci: Object.keys(spesa).length });
  } catch (e) {
    console.error('[spesa/mail]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

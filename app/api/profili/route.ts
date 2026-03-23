import { NextRequest, NextResponse } from 'next/server';
import { PROFILO_DEFAULT, Profilo } from '@/lib/profiles';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyCGNC4qa78C9XdB6ylXYnzcuSj2qGLVWkoMdJM19PkcTsjB8uk8ax7dehYQuTDUhOd/exec';

// GET /api/profili → lista tutti i profili
export async function GET() {
  try {
    const url = `${APPS_SCRIPT_URL}?action=getProfili`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.error || !Array.isArray(data)) {
      return NextResponse.json([PROFILO_DEFAULT]);
    }
    return NextResponse.json(data as Profilo[]);
  } catch {
    // Fallback: restituisce il profilo default
    return NextResponse.json([PROFILO_DEFAULT]);
  }
}

// POST /api/profili → crea o aggiorna profilo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profilo: Profilo = body.profilo;
    if (!profilo || !profilo.id) {
      return NextResponse.json({ error: 'Profilo mancante o senza id' }, { status: 400 });
    }
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveProfilo', profilo }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/profili?id=xxx → elimina profilo
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id mancante' }, { status: 400 });
    }
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'deleteProfilo', id }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

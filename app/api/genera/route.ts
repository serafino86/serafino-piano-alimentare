import { NextRequest, NextResponse } from 'next/server';
import { generaMese, calcolaSpesa, calcolaSpesaSettimane } from '@/lib/generator';
import { savePianoMensile } from '@/lib/sheets';
import type { PianoMese } from '@/lib/generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const anno = Number(body.anno);
    const mese = Number(body.mese);

    if (!anno || !mese || mese < 1 || mese > 12) {
      return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
    }

    // Se il client manda un piano già modificato (es. dopo sostituzione variante), lo salviamo.
    // Altrimenti generiamo uno nuovo da zero.
    const piano: PianoMese = body.piano ?? generaMese(anno, mese);
    const spesa = calcolaSpesa(piano);
    const settimane = calcolaSpesaSettimane(piano, anno, mese);

    // Salva su Sheets (non bloccante)
    try {
      await savePianoMensile(anno, mese, piano);
    } catch (e) {
      console.error('[genera] Errore salvataggio Sheets:', e);
    }

    return NextResponse.json({ piano, spesa, settimane });
  } catch (e) {
    console.error('[genera] Errore:', e);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

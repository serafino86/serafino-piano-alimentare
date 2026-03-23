import { NextRequest, NextResponse } from 'next/server';
import { generaMese, calcolaSpesa, calcolaSpesaSettimane } from '@/lib/generator';
import { getPianoMensile, savePianoMensile } from '@/lib/sheets';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const anno = Number(searchParams.get('anno'));
    const mese = Number(searchParams.get('mese'));

    if (!anno || !mese || mese < 1 || mese > 12) {
      return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
    }

    // Prova a leggere da Sheets
    let piano = await getPianoMensile(anno, mese);
    let fromSheets = !!piano;

    if (!piano) {
      // Genera e salva
      piano = generaMese(anno, mese);
      try {
        await savePianoMensile(anno, mese, piano);
      } catch (e) {
        console.error('[piano] Errore salvataggio Sheets:', e);
      }
    }

    const spesa = calcolaSpesa(piano);
    const settimane = calcolaSpesaSettimane(piano, anno, mese);

    return NextResponse.json({ piano, spesa, settimane, fromSheets });
  } catch (e) {
    const msg = e instanceof Error ? e.message + '\n' + e.stack : String(e);
    console.error('[piano] Errore:', msg);
    return NextResponse.json({ error: 'Errore interno', detail: msg }, { status: 500 });
  }
}

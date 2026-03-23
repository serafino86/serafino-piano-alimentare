import { NextRequest, NextResponse } from 'next/server';
import { generaMese } from '@/lib/generator';
import { savePianoMensile, archiviaMese } from '@/lib/sheets';

export async function GET(req: NextRequest) {
  // Verifica autorizzazione (Vercel Cron o chiamata manuale con secret)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron invia x-vercel-cron-signature oppure bearer token
  const isVercelCron = !!req.headers.get('x-vercel-cron-signature');
  const isAuthorized = isVercelCron || authHeader === `Bearer ${cronSecret}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const risultati: string[] = [];
  const errori: string[] = [];

  try {
    const now = new Date();
    const annoCorrente = now.getFullYear();
    const meseCorrente = now.getMonth() + 1;

    // 1. Archivia il mese corrente su Sheets (sposta il foglio in archivio)
    try {
      await archiviaMese(annoCorrente, meseCorrente);
      risultati.push(`Archiviato ${annoCorrente}/${meseCorrente}`);
    } catch (e) {
      errori.push(`Archiviazione fallita: ${e}`);
      console.error('[cron] Archiviazione fallita:', e);
    }

    // 2. Genera e salva il piano del mese PROSSIMO
    let annoProssimo = annoCorrente;
    let meseProssimo = meseCorrente + 1;
    if (meseProssimo > 12) { meseProssimo = 1; annoProssimo += 1; }

    const pianoProssimo = generaMese(annoProssimo, meseProssimo);
    await savePianoMensile(annoProssimo, meseProssimo, pianoProssimo);
    risultati.push(`Piano ${annoProssimo}/${meseProssimo} generato (${Object.keys(pianoProssimo).length} giorni)`);

    // 3. (Opzionale) Pre-genera anche quello dopo ancora per avere sempre 2 mesi avanti
    let annoDopoAnno = annoProssimo;
    let meseDopoAnno = meseProssimo + 1;
    if (meseDopoAnno > 12) { meseDopoAnno = 1; annoDopoAnno += 1; }

    try {
      const pianoDopoAnno = generaMese(annoDopoAnno, meseDopoAnno);
      await savePianoMensile(annoDopoAnno, meseDopoAnno, pianoDopoAnno);
      risultati.push(`Piano ${annoDopoAnno}/${meseDopoAnno} pre-generato`);
    } catch (e) {
      errori.push(`Pre-generazione mese+2 fallita: ${e}`);
    }

    console.log('[cron] Completato:', risultati);

    return NextResponse.json({
      ok: true,
      eseguito_il: now.toISOString(),
      risultati,
      errori: errori.length > 0 ? errori : undefined,
    });
  } catch (e) {
    console.error('[cron] Errore critico:', e);
    return NextResponse.json({ error: 'Errore interno', dettaglio: String(e) }, { status: 500 });
  }
}

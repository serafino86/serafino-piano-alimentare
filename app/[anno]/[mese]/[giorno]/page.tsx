import { GiornoViewClient } from '@/components/GiornoViewClient';
import { getPianoMensile, savePianoMensile } from '@/lib/sheets';
import { generaMese } from '@/lib/generator';

export default async function GiornoPage({
  params,
}: {
  params: Promise<{ anno: string; mese: string; giorno: string }>;
}) {
  const { anno: annoStr, mese: meseStr, giorno: giornoStr } = await params;
  const anno = Number(annoStr);
  const mese = Number(meseStr);
  const giorno = Number(giornoStr);

  const dataISO = `${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;

  // Genera sempre il piano localmente — garanzia che pianoGiorno non sia mai null
  // Prova prima da Sheets (dati personalizzati), fallback al generato
  let pianoGiorno = null;
  try {
    const pianoSheets = await getPianoMensile(anno, mese);
    if (pianoSheets) {
      pianoGiorno = pianoSheets[dataISO] ?? null;
    }
  } catch {
    // Sheets non raggiungibile
  }

  // Se Sheets fallisce o il giorno non c'è, genera localmente
  if (!pianoGiorno) {
    try {
      const pianoLocale = generaMese(anno, mese);
      pianoGiorno = pianoLocale[dataISO] ?? null;
      // Salva su Sheets in background (non blocca il rendering)
      if (pianoGiorno) {
        savePianoMensile(anno, mese, pianoLocale).catch(() => {});
      }
    } catch {
      // pianoGiorno rimane null solo se il giorno è fuori range
    }
  }

  return (
    <GiornoViewClient
      anno={anno}
      mese={mese}
      giorno={giorno}
      dataISO={dataISO}
      pianoGiorno={pianoGiorno}
    />
  );
}

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

  // Chiama le funzioni direttamente — nessun fetch HTTP interno
  let pianoGiorno = null;
  try {
    let piano = await getPianoMensile(anno, mese);
    if (!piano) {
      piano = generaMese(anno, mese);
      savePianoMensile(anno, mese, piano).catch(() => {}); // salva in background
    }
    pianoGiorno = piano[dataISO] ?? null;
  } catch {
    // pianoGiorno rimane null
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

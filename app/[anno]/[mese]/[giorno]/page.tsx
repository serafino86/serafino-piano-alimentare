import { GiornoViewClient } from '@/components/GiornoViewClient';

export default async function GiornoPage({
  params,
}: {
  params: Promise<{ anno: string; mese: string; giorno: string }>;
}) {
  const { anno: annoStr, mese: meseStr, giorno: giornoStr } = await params;
  const anno = Number(annoStr);
  const mese = Number(meseStr);
  const giorno = Number(giornoStr);

  // Costruisci data ISO
  const dataISO = `${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;

  // Fetch piano (server-side)
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3001';

  let pianoGiorno = null;
  try {
    const res = await fetch(`${baseUrl}/api/piano?anno=${anno}&mese=${mese}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    pianoGiorno = data.piano?.[dataISO] ?? null;
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

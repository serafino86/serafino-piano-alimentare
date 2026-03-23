import { PianoMensileClient } from '@/components/PianoMensileClient';

interface PageProps {
  params: Promise<{ anno: string; mese: string }>;
}

export default async function PianoPage({ params }: PageProps) {
  const { anno: annoStr, mese: meseStr } = await params;
  const anno = parseInt(annoStr, 10);
  const mese = parseInt(meseStr, 10);

  if (isNaN(anno) || isNaN(mese) || mese < 1 || mese > 12) {
    return <div style={{ padding: 32 }}>Parametri non validi</div>;
  }

  return (
    <PianoMensileClient
      anno={anno}
      mese={mese}
    />
  );
}

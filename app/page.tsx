'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const now = new Date();
    const anno = now.getFullYear();
    const mese = now.getMonth() + 1;
    const giorno = now.getDate();
    window.location.href = `/${anno}/${mese}/${giorno}`;
  }, []);

  // Mostra un loader mentre si reindirizza
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f0e8', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 32 }}>🌿</div>
      <div style={{ fontSize: 14, color: '#5a6b62', fontWeight: 600 }}>Piano Serafino...</div>
    </div>
  );
}

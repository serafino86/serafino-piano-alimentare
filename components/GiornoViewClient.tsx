'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GiornoPiano } from '@/lib/generator';
import {
  COLAZIONI,
  CENA_SAB,
  CENA_DOM,
  NOME_MESI_IT,
  PROTEINE,
  FECULENTI,
  GRASSI,
} from '@/lib/data';
import { PROFILO_DEFAULT, FASI } from '@/lib/profiles';
import { Ricetta } from '@/lib/groq';
import { generaPromptCulinario } from '@/lib/prompt-generator';
import { getFraseDelGiorno } from '@/lib/almanac';

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface Props {
  anno: number;
  mese: number;
  giorno: number;
  dataISO: string;
  pianoGiorno: GiornoPiano | null;
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// AlmanaccoBar — frase motivazionale del giorno
// ─────────────────────────────────────────

function AlmanaccoBar({ dataISO }: { dataISO: string }) {
  const frase = getFraseDelGiorno(dataISO);
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a2820, #2d4a35)',
        color: '#fff',
        padding: '14px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
        ✦ Coach del giorno ✦
      </div>
      <p style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.6, opacity: 0.92, margin: 0, maxWidth: 560, marginInline: 'auto' }}>
        "{frase.frase}"
      </p>
      {frase.autore && (
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6 }}>— {frase.autore}</div>
      )}
    </div>
  );
}

function getDaysInMonth(anno: number, mese: number): number {
  return new Date(anno, mese, 0).getDate();
}

function getStagione(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'primavera';
  if (m >= 6 && m <= 8) return 'estate';
  if (m >= 9 && m <= 11) return 'autunno';
  return 'inverno';
}

function progressColor(perc: number): string {
  if (perc >= 0.9) return 'var(--green)';
  if (perc >= 0.7) return 'var(--amber)';
  return '#c0392b';
}

// ─────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────

function ProgressBar({
  label,
  valore,
  target,
  unit,
  emoji,
}: {
  label: string;
  valore: number;
  target: number;
  unit: string;
  emoji: string;
}) {
  const perc = Math.min(valore / target, 1);
  const color = progressColor(perc);
  const percText = Math.round((valore / target) * 100);

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          fontSize: 13,
        }}
      >
        <span>
          {emoji} <strong>{label}</strong>: {valore}
          {unit} / {target}
          {unit}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color,
          }}
        >
          {percText}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: 'var(--line)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${perc * 100}%`,
            background: color,
            borderRadius: 99,
            transition: 'width .4s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// RicettaBox — per pranzo / cena
// ─────────────────────────────────────────

interface RicettaBoxProps {
  proteina: string;
  fecola: string;
  grasso: string;
  tipo: 'pranzo' | 'cena';
}

function RicettaBox({ proteina, fecola, grasso, tipo }: RicettaBoxProps) {
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [copiato, setCopiato] = useState(false);

  const profilo = PROFILO_DEFAULT;
  const fase = profilo.fase_attiva;

  const generaRicetta = useCallback(async () => {
    setLoading(true);
    setErrore(null);
    try {
      const res = await fetch('/api/ricetta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proteina,
          fecola,
          grasso,
          tipo,
          profilo: { nome: profilo.nome, peso_kg: profilo.peso_kg },
          fase,
          stagione: getStagione(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrore(data.error ?? 'Errore nella generazione');
      } else {
        setRicetta(data.ricetta);
      }
    } catch {
      setErrore('Errore di rete');
    } finally {
      setLoading(false);
    }
  }, [proteina, fecola, grasso, tipo, profilo.nome, profilo.peso_kg, fase]);

  const copiaPrompt = useCallback(async () => {
    const prompt = generaPromptCulinario({
      proteina,
      fecola,
      grasso,
      tipo,
      profilo: { nome: profilo.nome, peso_kg: profilo.peso_kg },
      fase,
      stagione: getStagione(),
    });
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);
    } catch {
      // fallback
    }
  }, [proteina, fecola, grasso, tipo, profilo.nome, profilo.peso_kg, fase]);

  if (loading) {
    return (
      <div
        style={{
          background: 'var(--green-light)',
          border: '1px solid var(--green-soft)',
          borderRadius: 10,
          padding: '16px 18px',
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--green)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            border: '2px solid var(--green)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        Generazione ricetta con Llama 3.3...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!ricetta) {
    return (
      <div
        style={{
          background: 'var(--amber-light)',
          border: '1px solid #f0d080',
          borderRadius: 10,
          padding: '14px 18px',
          marginTop: 10,
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
          Ricetta non ancora generata per questo pasto
        </div>
        {errore && (
          <div
            style={{
              fontSize: 12,
              color: '#c0392b',
              background: '#fdeaea',
              border: '1px solid #c0392b',
              borderRadius: 6,
              padding: '6px 10px',
              marginBottom: 10,
            }}
          >
            {errore}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={generaRicetta}
            style={{
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ⟳ Genera con Llama
          </button>
          <button
            onClick={copiaPrompt}
            style={{
              background: 'var(--paper)',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copiato ? '✓ Copiato!' : '📋 Copia prompt'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--green-soft)',
        borderRadius: 10,
        padding: '16px 18px',
        marginTop: 10,
        animation: 'fadeIn .4s ease',
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Titolo ricetta */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{ricetta.nome}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
          {ricetta.sottotitolo}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 6,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <span>⏱ {ricetta.tempo_prep} min prep</span>
          <span>🔥 {ricetta.tempo_cottura} min cottura</span>
          <span
            style={{
              background: 'var(--green-light)',
              color: 'var(--green)',
              padding: '1px 8px',
              borderRadius: 99,
              fontWeight: 600,
            }}
          >
            {ricetta.tecnica}
          </span>
        </div>
      </div>

      {/* Ingredienti */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: 'var(--muted)',
            marginBottom: 6,
          }}
        >
          Ingredienti
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {ricetta.ingredienti.map((ing, i) => (
            <li
              key={i}
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                display: 'flex',
                gap: 8,
                marginBottom: 3,
              }}
            >
              <span style={{ color: 'var(--green)', flexShrink: 0 }}>•</span>
              <span>
                <strong>{ing.quantita}</strong> {ing.nome}
                {ing.note && (
                  <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}> ({ing.note})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preparazione */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: 'var(--muted)',
            marginBottom: 6,
          }}
        >
          Preparazione
        </div>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          {ricetta.preparazione.map((passo, i) => (
            <li key={i} style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>
              {passo}
            </li>
          ))}
        </ol>
      </div>

      {/* Consiglio e principio */}
      {ricetta.consiglio_chef && (
        <div
          style={{
            background: 'var(--green-light)',
            border: '1px solid var(--green-soft)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: 'var(--green)',
            marginBottom: 6,
          }}
        >
          💡 <strong>Consiglio:</strong> {ricetta.consiglio_chef}
        </div>
      )}
      {ricetta.principio_nutrizionale && (
        <div
          style={{
            background: '#f0f7f0',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: 'var(--muted)',
            marginBottom: 6,
          }}
        >
          🌿 <strong>Principio:</strong> {ricetta.principio_nutrizionale}
        </div>
      )}
      {ricetta.variante_stagionale && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--amber)',
            fontStyle: 'italic',
            marginBottom: 6,
          }}
        >
          🍂 <strong>Variante stagionale:</strong> {ricetta.variante_stagionale}
        </div>
      )}

      {/* Azioni */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => setRicetta(null)}
          style={{
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          ⟳ Rigenera
        </button>
        <button
          onClick={copiaPrompt}
          style={{
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          {copiato ? '✓ Copiato!' : '📋 Copia prompt'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PastoCard per pranzo/cena
// ─────────────────────────────────────────

interface PastoCardProps {
  emoji: string;
  label: string;
  orario: string;
  proteina: string;
  fecola: string;
  grasso: string;
  macro: { kcal: number; prot: number };
  tipo: 'pranzo' | 'cena';
}

function PastoCard({
  emoji,
  label,
  orario,
  proteina,
  fecola,
  grasso,
  macro,
  tipo,
}: PastoCardProps) {
  const prot = PROTEINE[proteina];
  const fec = FECULENTI[fecola];
  const gras = GRASSI[grasso];

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,40,32,.06)',
        marginBottom: 14,
      }}
    >
      {/* Header pasto */}
      <div
        style={{
          background: 'linear-gradient(135deg,var(--green-light),#e8f2e8)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          {emoji} {label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{orario}</span>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Componenti */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '5px 0',
              borderBottom: '1px solid var(--line)',
              fontSize: 13,
              color: 'var(--ink)',
            }}
          >
            <span style={{ width: 22 }}>🥩</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{proteina}</div>
              {prot && (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {prot.q_str} · {prot.prot}g prot · {prot.kcal} kcal
                  {prot.note && (
                    <span style={{ fontStyle: 'italic' }}> — {prot.note}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '5px 0',
              borderBottom: '1px solid var(--line)',
              fontSize: 13,
              color: 'var(--ink)',
            }}
          >
            <span style={{ width: 22 }}>🍚</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{fecola}</div>
              {fec && (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {fec.q_str} · {fec.prot}g prot · {fec.kcal} kcal
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '5px 0',
              fontSize: 13,
              color: 'var(--ink)',
            }}
          >
            <span style={{ width: 22 }}>🫒</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{grasso}</div>
              {gras && (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {gras.q_str} · {gras.kcal} kcal
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Totale macro */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            background: 'var(--green-light)',
            border: '1px solid var(--green-soft)',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--green)',
            marginBottom: 10,
          }}
        >
          <span>→ {macro.kcal} kcal · {macro.prot}g proteine ✓</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>+300g verdure</span>
        </div>

        {/* Ricetta */}
        <RicettaBox proteina={proteina} fecola={fecola} grasso={grasso} tipo={tipo} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// CenaSpecialeCard
// ─────────────────────────────────────────

function CenaSpecialeCard({ speciale }: { speciale: 'SAB' | 'DOM' }) {
  const dati = speciale === 'SAB' ? CENA_SAB : CENA_DOM;

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,40,32,.06)',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          background: speciale === 'SAB'
            ? 'linear-gradient(135deg,#eef5ee,#d4e8d4)'
            : 'linear-gradient(135deg,#f0e8ff,#e0d4f8)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          🌙 Cena
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>19:30</span>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div
          style={{
            display: 'inline-block',
            background: speciale === 'SAB' ? 'var(--green-light)' : '#f0e8ff',
            color: speciale === 'SAB' ? 'var(--green)' : '#6b3a8b',
            border: `1px solid ${speciale === 'SAB' ? 'var(--green-soft)' : '#d4b8f0'}`,
            borderRadius: 8,
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {speciale === 'SAB' ? '🍝 Cena speciale sabato — Pasta di legumi' : '🫘 Cena speciale domenica — Beans based'}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13, color: 'var(--ink)' }}>
          {dati.componenti.map((c, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'var(--green)' }}>•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--green)',
            background: 'var(--green-light)',
            border: '1px solid var(--green-soft)',
            borderRadius: 8,
            padding: '6px 10px',
          }}
        >
          → {dati.macro.kcal} kcal · {dati.macro.prot}g proteine
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ColazioneAccordion
// ─────────────────────────────────────────

function ColazioneAccordion({ tipo, dataISO }: { tipo: string; dataISO: string }) {
  const colazione = COLAZIONI[tipo];
  const [aperto, setAperto] = useState(false);
  const storageKey = `colazione-scelta-${dataISO}`;
  const [sceltaIdx, setSceltaIdx] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? Number(saved) : 0;
  });

  const scegliOpzione = (idx: number) => {
    setSceltaIdx(idx);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(idx));
    }
  };

  if (!colazione) return null;

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,40,32,.06)',
        marginBottom: 14,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg,#fff8e8,#f5eed8)',
          padding: '10px 16px',
          borderBottom: aperto ? '1px solid var(--line)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          🌅 Colazione
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{colazione.orario}</span>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Opzione corrente */}
        <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>
          {colazione.opzioni[sceltaIdx]?.nome ?? colazione.nome}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
          {colazione.opzioni[sceltaIdx]?.descr}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--green-light)',
            border: '1px solid var(--green-soft)',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--green)',
            marginBottom: 10,
          }}
        >
          {colazione.opzioni[sceltaIdx]?.prot ?? colazione.macro.prot}g prot ·{' '}
          {colazione.opzioni[sceltaIdx]?.kcal ?? colazione.macro.kcal} kcal
        </div>

        {/* Accordion */}
        <button
          onClick={() => setAperto(!aperto)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            color: 'var(--muted)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Opzioni colazione {aperto ? '▲' : '▼'}
        </button>

        {aperto && (
          <div style={{ marginTop: 10 }}>
            {colazione.opzioni.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => scegliOpzione(idx)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  marginBottom: 6,
                  cursor: 'pointer',
                  background: idx === sceltaIdx ? 'var(--green-light)' : 'var(--bg)',
                  border: idx === sceltaIdx ? '1px solid var(--green)' : '1px solid var(--line)',
                  transition: 'all .15s',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: idx === sceltaIdx ? 700 : 400,
                    color: idx === sceltaIdx ? 'var(--green)' : 'var(--ink)',
                  }}
                >
                  {idx === sceltaIdx ? '✓ ' : ''}
                  {opt.nome}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {opt.descr}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    marginTop: 3,
                  }}
                >
                  {opt.prot}g prot · {opt.kcal} kcal
                </div>
              </div>
            ))}
          </div>
        )}

        {colazione.nota && (
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--muted)',
              fontStyle: 'italic',
            }}
          >
            {colazione.nota}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SpuntinoCard
// ─────────────────────────────────────────

function SpuntinoCard({
  emoji,
  label,
  orario,
  contenuto,
  nota,
}: {
  emoji: string;
  label: string;
  orario: string;
  contenuto: string | string[];
  nota?: string;
}) {
  const righe = Array.isArray(contenuto) ? contenuto : [contenuto];

  return (
    <div
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,40,32,.06)',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg,#fff5e8,#f5edd8)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          {emoji} {label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{orario}</span>
      </div>
      <div style={{ padding: '12px 16px' }}>
        {righe.map((r, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 3 }}>
            {r}
          </div>
        ))}
        {nota && (
          <div style={{ fontSize: 12, color: 'var(--amber)', marginTop: 6, fontStyle: 'italic' }}>
            💡 {nota}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Componente principale GiornoViewClient
// ─────────────────────────────────────────

export function GiornoViewClient({ anno, mese, giorno, dataISO, pianoGiorno }: Props) {
  const router = useRouter();
  const profilo = PROFILO_DEFAULT;
  const fase = FASI[profilo.fase_attiva];

  // Navigazione giorni
  const daysInMonth = getDaysInMonth(anno, mese);

  const navPrev = () => {
    if (giorno > 1) {
      router.push(`/${anno}/${mese}/${giorno - 1}`);
    } else if (mese > 1) {
      const prevMese = mese - 1;
      const prevDays = getDaysInMonth(anno, prevMese);
      router.push(`/${anno}/${prevMese}/${prevDays}`);
    } else {
      router.push(`/${anno - 1}/12/${getDaysInMonth(anno - 1, 12)}`);
    }
  };

  const navNext = () => {
    if (giorno < daysInMonth) {
      router.push(`/${anno}/${mese}/${giorno + 1}`);
    } else if (mese < 12) {
      router.push(`/${anno}/${mese + 1}/1`);
    } else {
      router.push(`/${anno + 1}/1/1`);
    }
  };

  // Calcolo macro giornata
  const colazione = pianoGiorno ? COLAZIONI[pianoGiorno.tipo] : null;
  const targetProt = Math.round(profilo.peso_kg * fase.prot_per_kg);
  const targetKcal = fase.kcal_pasto * 2 + 400 + 180 + 150;

  let macroGiornata = { prot: 0, kcal: 0 };
  if (pianoGiorno && colazione) {
    const pranzoMacro = pianoGiorno.pranzo.macro;
    const cenaMacro = pianoGiorno.cena.macro;
    macroGiornata = {
      prot: colazione.macro.prot + pranzoMacro.prot + cenaMacro.prot + 38 + 10,
      kcal: colazione.macro.kcal + pranzoMacro.kcal + cenaMacro.kcal + 180 + 150,
    };
  }

  // Label giorno
  const nomeMese = NOME_MESI_IT[mese] ?? '';
  const giornoNome = pianoGiorno?.giorno_breve ?? '';
  const tipoGiorno = pianoGiorno?.tipo ?? '';

  const tipoColors: Record<string, { bg: string; color: string }> = {
    LMV: { bg: '#1a6b9a', color: '#fff' },
    MT:  { bg: '#6b3a1a', color: '#fff' },
    SAB: { bg: 'var(--green)', color: '#fff' },
    DOM: { bg: '#8b3a8b', color: '#fff' },
  };
  const tipoC = tipoColors[tipoGiorno] ?? { bg: '#888', color: '#fff' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ─── HEADER NAVIGAZIONE ─── */}
      <div
        style={{
          background: 'var(--paper)',
          borderBottom: '1px solid var(--line)',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(26,40,32,.08)',
        }}
      >
        {/* Riga navigazione giorni */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0 8px',
          }}
        >
          <button
            onClick={navPrev}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 20,
              color: 'var(--ink)',
              cursor: 'pointer',
              fontWeight: 600,
              minWidth: 52,
              minHeight: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
              {giornoNome} {giorno} {nomeMese} {anno}
            </div>
            {tipoGiorno && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  background: tipoC.bg,
                  color: tipoC.color,
                  padding: '1px 8px',
                  borderRadius: 99,
                  letterSpacing: '.06em',
                }}
              >
                {tipoGiorno}
              </span>
            )}
          </div>

          <button
            onClick={navNext}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 20,
              color: 'var(--ink)',
              cursor: 'pointer',
              fontWeight: 600,
              minWidth: 52,
              minHeight: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </button>
        </div>

        {/* Riga info profilo + torna al mese */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0 10px',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'var(--green-light)',
                border: '1px solid var(--green-soft)',
                color: 'var(--green)',
                borderRadius: 8,
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              👤 {profilo.nome}
            </span>
            <span
              style={{
                background: 'var(--amber-light)',
                border: '1px solid #f0d080',
                color: 'var(--amber)',
                borderRadius: 8,
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {fase.icona} {fase.nome}
            </span>
          </div>
          <a
            href={`/${anno}/${mese}`}
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              textDecoration: 'none',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: '3px 10px',
              fontWeight: 600,
            }}
          >
            ← Torna al mese
          </a>
        </div>
      </div>

      {/* ─── ALMANACCO ─── */}
      <AlmanaccoBar dataISO={dataISO} />

      {/* ─── CONTENUTO ─── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 12px 100px' }}>
        {!pianoGiorno ? (
          <div
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: 32,
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: 14,
            }}
          >
            Piano non disponibile per questo giorno.{' '}
            <a href={`/${anno}/${mese}`} style={{ color: 'var(--green)' }}>
              Torna al mese
            </a>{' '}
            per generarlo.
          </div>
        ) : (
          <>
            {/* Riepilogo macro */}
            <div
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 14,
                boxShadow: '0 2px 10px rgba(26,40,32,.06)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                  color: 'var(--muted)',
                  marginBottom: 12,
                }}
              >
                Riepilogo macro giornaliero
              </div>
              <ProgressBar
                emoji="🔵"
                label="Proteine"
                valore={macroGiornata.prot}
                target={targetProt}
                unit="g"
              />
              <ProgressBar
                emoji="🟡"
                label="Calorie"
                valore={macroGiornata.kcal}
                target={targetKcal}
                unit=" kcal"
              />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                Shake: +38g prot, +180 kcal · Goûter: +10g prot, +150 kcal
              </div>
            </div>

            {/* Colazione */}
            <ColazioneAccordion tipo={pianoGiorno.tipo} dataISO={dataISO} />

            {/* Spuntino mattina */}
            <SpuntinoCard
              emoji="🍎"
              label="Spuntino mattina"
              orario="10:00"
              contenuto="1 frutto di stagione (~150g)"
              nota="Frutta di stagione: fragole, mele, pere, kiwi, arance, albicocche..."
            />

            {/* Pranzo */}
            <PastoCard
              emoji="🍽"
              label="Pranzo"
              orario="12:30"
              proteina={pianoGiorno.pranzo.proteina}
              fecola={pianoGiorno.pranzo.fecola}
              grasso={pianoGiorno.pranzo.grasso}
              macro={pianoGiorno.pranzo.macro}
              tipo="pranzo"
            />

            {/* Spuntino pomeriggio */}
            <SpuntinoCard
              emoji="🥤"
              label="Spuntino pomeriggio"
              orario="16:00"
              contenuto={[
                'Shake: 30g whey + 5g creatina',
                'Goûter: olive/formaggio/hummus/oleaginosi (15g) + 100g cottage cheese + crudités',
              ]}
            />

            {/* Cena */}
            {pianoGiorno.cena.speciale ? (
              <CenaSpecialeCard speciale={pianoGiorno.cena.speciale} />
            ) : (
              <PastoCard
                emoji="🌙"
                label="Cena"
                orario="19:30"
                proteina={pianoGiorno.cena.proteina!}
                fecola={pianoGiorno.cena.fecola!}
                grasso={pianoGiorno.cena.grasso!}
                macro={pianoGiorno.cena.macro}
                tipo="cena"
              />
            )}

            {/* Eccezione */}
            {pianoGiorno.eccezione && pianoGiorno.note_eccezione && (
              <div
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13,
                  color: 'var(--amber)',
                  marginBottom: 14,
                }}
              >
                ⚠️ <strong>Eccezione:</strong> {pianoGiorno.note_eccezione}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom sticky nav ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--paper)', borderTop: '1.5px solid var(--line)',
        padding: '10px 16px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', gap: 8, zIndex: 200,
      }}>
        <a href={`/${anno}/${mese}`} style={{
          flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12,
          background: 'var(--green-light)', border: '1px solid var(--green-soft)',
          color: 'var(--green)', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          📅 Piano mese
        </a>
        <button onClick={navPrev} style={{
          padding: '12px 20px', borderRadius: 12, border: '1px solid var(--line)',
          background: 'var(--paper)', cursor: 'pointer', fontSize: 18, color: 'var(--ink)',
          fontWeight: 700, minWidth: 52,
        }}>←</button>
        <button onClick={navNext} style={{
          padding: '12px 20px', borderRadius: 12, border: '1px solid var(--line)',
          background: 'var(--paper)', cursor: 'pointer', fontSize: 18, color: 'var(--ink)',
          fontWeight: 700, minWidth: 52,
        }}>→</button>
      </div>
    </div>
  );
}

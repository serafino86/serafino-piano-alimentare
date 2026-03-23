'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Profilo, Fase, FaseId, FASI, PROFILO_DEFAULT, calcolaTarget } from '@/lib/profiles';

export interface ProfiloSelectorProps {
  profilo: Profilo;
  fase: Fase;
  onChange: (profilo: Profilo, fase: Fase) => void;
}

const LS_KEY = 'piano_profilo_cache';

function salvaCache(profilo: Profilo, faseId: FaseId) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ profilo, faseId }));
  } catch { /* ignore */ }
}

function leggiCache(): { profilo: Profilo; faseId: FaseId } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.profilo && parsed?.faseId) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function fetchProfili(): Promise<Profilo[]> {
  try {
    const res = await fetch('/api/profili', { cache: 'no-store' });
    if (!res.ok) return [PROFILO_DEFAULT];
    const data = await res.json();
    return Array.isArray(data) ? data : [PROFILO_DEFAULT];
  } catch {
    return [PROFILO_DEFAULT];
  }
}

async function saveProfilo(profilo: Profilo): Promise<void> {
  try {
    await fetch('/api/profili', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profilo }),
    });
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────
// Mini form per nuovo profilo
// ─────────────────────────────────────────

function NuovoProfiloForm({
  onSalva,
  onAnnulla,
}: {
  onSalva: (p: Profilo) => void;
  onAnnulla: () => void;
}) {
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [altezza, setAltezza] = useState('');
  const [eta, setEta] = useState('');
  const [sesso, setSesso] = useState<'M' | 'F'>('M');
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setErr('Inserisci un nome'); return; }
    const p = parseFloat(peso);
    const a = parseFloat(altezza);
    const et = parseInt(eta, 10);
    if (isNaN(p) || p < 30 || p > 250) { setErr('Peso non valido (30-250 kg)'); return; }
    if (isNaN(a) || a < 100 || a > 250) { setErr('Altezza non valida (100-250 cm)'); return; }
    if (isNaN(et) || et < 10 || et > 120) { setErr('Età non valida'); return; }

    const nuovoProfilo: Profilo = {
      id: nome.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      nome: nome.trim(),
      peso_kg: p,
      altezza_cm: a,
      eta: et,
      sesso,
      fase_attiva: 'mantenimento',
      creato_il: new Date().toISOString().slice(0, 10),
    };
    onSalva(nuovoProfilo);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid var(--line)',
    borderRadius: 7,
    fontSize: 12,
    color: 'var(--ink)',
    background: 'var(--bg)',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '12px 14px', borderTop: '1px solid var(--line)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
        Nuovo profilo
      </div>
      {err && (
        <div style={{ fontSize: 11, color: '#c0392b', marginBottom: 6 }}>{err}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          style={inputStyle}
          autoFocus
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <input placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} style={inputStyle} type="number" step="0.1" />
          <input placeholder="Altezza (cm)" value={altezza} onChange={e => setAltezza(e.target.value)} style={inputStyle} type="number" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <input placeholder="Età" value={eta} onChange={e => setEta(e.target.value)} style={inputStyle} type="number" />
          <select value={sesso} onChange={e => setSesso(e.target.value as 'M' | 'F')} style={inputStyle}>
            <option value="M">Uomo</option>
            <option value="F">Donna</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
          <button type="submit" style={{
            flex: 1, padding: '7px 0', borderRadius: 8,
            background: 'var(--green)', color: '#fff',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            Crea profilo
          </button>
          <button type="button" onClick={onAnnulla} style={{
            padding: '7px 12px', borderRadius: 8,
            background: 'none', color: 'var(--muted)',
            border: '1px solid var(--line)', fontSize: 12, cursor: 'pointer',
          }}>
            Annulla
          </button>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────
// ProfiloSelector principale
// ─────────────────────────────────────────

export function ProfiloSelector({ profilo, fase, onChange }: ProfiloSelectorProps) {
  const [open, setOpen] = useState(false);
  const [profili, setProfili] = useState<Profilo[]>([profilo]);
  const [mostraForm, setMostraForm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const target = calcolaTarget(profilo, fase);

  // Carica profili da Sheets in background
  useEffect(() => {
    fetchProfili().then(lista => {
      if (lista.length > 0) setProfili(lista);
    });
  }, []);

  // Chiudi popover cliccando fuori
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setMostraForm(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelezionaProfilo = (p: Profilo) => {
    const nuovaFase = FASI[p.fase_attiva] ?? fase;
    salvaCache(p, nuovaFase.id);
    onChange(p, nuovaFase);
    setOpen(false);
    setMostraForm(false);
    // Sync su Sheets in background
    saveProfilo(p);
  };

  const handleCambiafase = (faseId: FaseId) => {
    const nuovaFase = FASI[faseId];
    const profiloAggiornato: Profilo = { ...profilo, fase_attiva: faseId };
    salvaCache(profiloAggiornato, faseId);
    onChange(profiloAggiornato, nuovaFase);
    // Sync su Sheets in background
    saveProfilo(profiloAggiornato);
  };

  const handleNuovoProfilo = (p: Profilo) => {
    setProfili(prev => {
      const filtered = prev.filter(x => x.id !== p.id);
      return [...filtered, p];
    });
    handleSelezionaProfilo(p);
    setMostraForm(false);
    saveProfilo(p);
  };

  const faseBtnBase: React.CSSProperties = {
    padding: '5px 10px',
    borderRadius: 8,
    border: '1px solid',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all .12s',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Riga 1: selettore profilo + selettore fase */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Dropdown profilo */}
        <div style={{ position: 'relative' }}>
          <button
            ref={btnRef}
            onClick={() => { setOpen(v => !v); setMostraForm(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 8,
              border: '1px solid var(--line)',
              background: 'var(--paper)', color: 'var(--ink)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(26,40,32,.07)',
            }}
          >
            <span>👤</span>
            <span>{profilo.nome}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 2 }}>▼</span>
          </button>

          {open && (
            <div
              ref={popoverRef}
              style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                background: 'var(--paper)', border: '1px solid var(--line)',
                borderRadius: 12, boxShadow: '0 8px 32px rgba(26,40,32,.15)',
                zIndex: 500, minWidth: 220, maxWidth: 280,
                overflow: 'hidden',
              }}
            >
              {/* Lista profili */}
              <div style={{ padding: '8px 0' }}>
                {profili.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelezionaProfilo(p)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '8px 14px',
                      background: p.id === profilo.id ? 'var(--green-light)' : 'none',
                      border: 'none', cursor: 'pointer', fontSize: 12,
                      color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 1,
                      transition: 'background .1s',
                    }}
                    onMouseEnter={e => {
                      if (p.id !== profilo.id)
                        (e.currentTarget as HTMLElement).style.background = '#f5f5f2';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background =
                        p.id === profilo.id ? 'var(--green-light)' : 'none';
                    }}
                  >
                    <span style={{ fontWeight: p.id === profilo.id ? 700 : 500 }}>
                      {p.id === profilo.id && <span style={{ color: 'var(--green)', marginRight: 4 }}>✓</span>}
                      {p.nome} {p.cognome ?? ''}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {FASI[p.fase_attiva]?.icona} {FASI[p.fase_attiva]?.nome} · {p.peso_kg} kg
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottone nuovo profilo */}
              {!mostraForm ? (
                <div style={{ padding: '6px 14px 10px', borderTop: '1px solid var(--line)' }}>
                  <button
                    onClick={() => setMostraForm(true)}
                    style={{
                      width: '100%', padding: '7px 0', borderRadius: 8,
                      border: '1px dashed var(--green)', background: 'var(--green-light)',
                      color: 'var(--green)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    + Nuovo profilo
                  </button>
                </div>
              ) : (
                <NuovoProfiloForm
                  onSalva={handleNuovoProfilo}
                  onAnnulla={() => setMostraForm(false)}
                />
              )}
            </div>
          )}
        </div>

        {/* Selettore fase — 3 bottoni */}
        {(Object.values(FASI) as Fase[]).map(f => {
          const attiva = f.id === fase.id;
          return (
            <button
              key={f.id}
              onClick={() => handleCambiafase(f.id)}
              style={{
                ...faseBtnBase,
                borderColor: attiva ? f.colore : 'var(--line)',
                background: attiva ? f.colore : 'var(--paper)',
                color: attiva ? '#fff' : 'var(--ink)',
              }}
            >
              <span>{f.icona}</span>
              <span>{f.nome}</span>
              {attiva && <span style={{ fontSize: 10 }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Riga 2: mini riepilogo target */}
      <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          `${target.prot_giorno}g prot/gg`,
          `${target.kcal_pasto} kcal/pasto`,
          `${target.prot_pasto}g prot/pasto`,
        ].map(t => (
          <span
            key={t}
            style={{
              background: 'var(--green-soft)',
              border: '1px solid var(--green)',
              color: 'var(--green)',
              padding: '3px 9px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Hook per caricare il profilo iniziale
// ─────────────────────────────────────────

export function useProfiloIniziale(): { profilo: Profilo; fase: Fase } {
  const cached = leggiCache();
  if (cached) {
    return {
      profilo: cached.profilo,
      fase: FASI[cached.faseId] ?? FASI['mantenimento'],
    };
  }
  return {
    profilo: PROFILO_DEFAULT,
    fase: FASI['mantenimento'],
  };
}

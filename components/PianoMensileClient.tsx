'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GiornoPiano, PianoMese, SpesaVoce, SettimanaSpesa } from '@/lib/generator';
import { PROTEINE, FECULENTI, GRASSI, COLAZIONI, CENA_SAB, CENA_DOM, NOME_MESI_IT } from '@/lib/data';
import { Profilo, Fase, FASI, PROFILO_DEFAULT } from '@/lib/profiles';
import { ProfiloSelector, useProfiloIniziale } from '@/components/ProfiloSelector';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface Props { anno: number; mese: number; }
type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error';
type PastoTipo = 'pranzo' | 'cena';
type ComponenteTipo = 'proteina' | 'fecola' | 'grasso';

interface ModalState {
  data: string;           // ISO date del giorno
  pasto: PastoTipo;
  componente: ComponenteTipo;
  corrente: string;       // chiave corrente
  alternative: string[];  // chiavi alternative dalla lista alt[]
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function macroBadgeColor(kcal: number, prot: number): 'green' | 'amber' | 'red' {
  if (prot >= 50 && kcal >= 570) return 'green';
  if (prot >= 40 && kcal >= 500) return 'amber';
  return 'red';
}

function isToday(dataStr: string): boolean {
  return dataStr === new Date().toISOString().slice(0, 10);
}

function calcolaMacroFront(protId: string, fecId: string, grasId: string): { kcal: number; prot: number } {
  const p = PROTEINE[protId] ?? { kcal: 0, prot: 0 };
  const f = FECULENTI[fecId] ?? { kcal: 0, prot: 0 };
  const g = GRASSI[grasId] ?? { kcal: 0, prot: 0 };
  return { kcal: p.kcal + f.kcal + g.kcal + 50, prot: p.prot + f.prot + g.prot + 3 };
}

function getDb(comp: ComponenteTipo) {
  if (comp === 'proteina') return PROTEINE;
  if (comp === 'fecola') return FECULENTI;
  return GRASSI;
}

function getAlt(comp: ComponenteTipo, chiave: string): string[] {
  const db = getDb(comp) as Record<string, { alt?: string[] }>;
  return db[chiave]?.alt ?? [];
}

// ─────────────────────────────────────────
// MacroBadge
// ─────────────────────────────────────────

function MacroBadge({ kcal, prot }: { kcal: number; prot: number }) {
  const color = macroBadgeColor(kcal, prot);
  const colors = {
    green: { bg: '#eef5ee', border: '#4f7a54', text: '#1a5c1a' },
    amber: { bg: '#fef9ee', border: '#d4820a', text: '#8b4500' },
    red:   { bg: '#fdeaea', border: '#c0392b', text: '#c0392b' },
  };
  const c = colors[color];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10,
      fontWeight: 700, background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '2px 7px', borderRadius: 999, marginTop: 4 }}>
      {kcal} kcal &nbsp;|&nbsp; {prot}g prot
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    LMV: { bg: '#1a6b9a', color: '#fff' },
    MT:  { bg: '#6b3a1a', color: '#fff' },
    SAB: { bg: '#4f7a54', color: '#fff' },
    DOM: { bg: '#8b3a8b', color: '#fff' },
  };
  const c = colors[tipo] ?? { bg: '#888', color: '#fff' };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, background: c.bg, color: c.color,
      padding: '2px 6px', borderRadius: 999, textTransform: 'uppercase' as const,
      letterSpacing: '0.06em' }}>
      {tipo}
    </span>
  );
}

// ─────────────────────────────────────────
// ComponenteRiga — cliccabile
// ─────────────────────────────────────────

function ComponenteRiga({
  icon, label, onClick, hasAlt,
}: {
  icon: string; label: string; onClick?: () => void; hasAlt?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      title={onClick ? 'Clicca per cambiare' : undefined}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 5, padding: '3px 4px',
        fontSize: 11, color: 'var(--ink)', borderRadius: 6,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .12s',
        background: 'transparent',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = 'var(--green-light)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={label}>
        {label}
      </span>
      {hasAlt && onClick && (
        <span style={{ color: 'var(--green)', fontSize: 10, flexShrink: 0, fontWeight: 700 }}>↕</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Modal variante
// ─────────────────────────────────────────

function ModalVariante({
  modal, piano, onClose, onSostituisci,
}: {
  modal: ModalState;
  piano: PianoMese;
  onClose: () => void;
  onSostituisci: (nuova: string) => void;
}) {
  const db = getDb(modal.componente) as Record<string, { q_str: string; prot: number; kcal: number; note: string; tipo?: string }>;
  const corrente = db[modal.corrente];
  const giornoData = piano[modal.data];
  const labelComp = modal.componente === 'proteina' ? 'Proteina' : modal.componente === 'fecola' ? 'Feculento' : 'Grasso';
  const labelPasto = modal.pasto === 'pranzo' ? 'Pranzo' : 'Cena';

  // Tutte le opzioni: alternative specifiche + tutte le chiavi del db (esclusi se già presenti)
  const altSpecifiche = modal.alternative.filter(a => a in db);
  const tutteLeChiavi = Object.keys(db).filter(k => k !== modal.corrente && !altSpecifiche.includes(k));
  const opzioni = [...altSpecifiche, ...tutteLeChiavi];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div style={{
        background: 'var(--paper)', borderRadius: 16, padding: 20, maxWidth: 420, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
              {labelPasto} · {labelComp}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>
              {giornoData.giorno_breve} {giornoData.giorno} — Cambia piatto
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)', lineHeight: 1 }}>✕</button>
        </div>

        {/* Selezione corrente */}
        <div style={{
          background: 'var(--green-light)', border: '2px solid var(--green)', borderRadius: 10,
          padding: '10px 12px', marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
            Attuale
          </div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{modal.corrente}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {corrente?.q_str} · {corrente?.prot}g prot · {corrente?.kcal} kcal
          </div>
          {corrente?.note && (
            <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginTop: 3 }}>{corrente.note}</div>
          )}
        </div>

        {/* Lista alternative */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
          Varianti disponibili ({opzioni.length})
        </div>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {opzioni.map((chiave, i) => {
            const item = db[chiave];
            const isAltSuggerita = i < altSpecifiche.length;
            return (
              <button
                key={chiave}
                onClick={() => onSostituisci(chiave)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                  border: `1px solid ${isAltSuggerita ? 'var(--green)' : 'var(--line)'}`,
                  background: isAltSuggerita ? 'var(--green-light)' : 'var(--paper)',
                  cursor: 'pointer', transition: 'all .12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#eef5ee'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isAltSuggerita ? 'var(--green-light)' : 'var(--paper)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--ink)' }}>
                      {isAltSuggerita && <span style={{ color: 'var(--green)', marginRight: 4 }}>★</span>}
                      {chiave}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                      {item?.q_str} · {item?.prot}g prot · {item?.kcal} kcal
                      {(item as { tipo?: string })?.tipo === 'grassa' && (
                        <span style={{ marginLeft: 6, color: 'var(--amber)', fontWeight: 700, fontSize: 10 }}>⚠ grassa</span>
                      )}
                    </div>
                    {item?.note && (
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginTop: 2 }}>{item.note}</div>
                    )}
                  </div>
                  <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0, fontSize: 16, marginTop: 2 }}>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// GiornoCard
// ─────────────────────────────────────────

function GiornoCard({
  giorno, onOpenModal,
}: {
  giorno: GiornoPiano;
  onOpenModal: (pasto: PastoTipo, comp: ComponenteTipo) => void;
}) {
  const oggi = isToday(giorno.data);
  const colazione = COLAZIONI[giorno.tipo];

  return (
    <div style={{
      background: 'var(--paper)',
      border: oggi ? '2px solid var(--green)' : '1px solid var(--line)',
      borderRadius: 12, overflow: 'hidden',
      boxShadow: oggi ? '0 0 0 3px var(--green-soft)' : '0 2px 8px rgba(26,40,32,.05)',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px', background: 'linear-gradient(135deg,#f8f5ed,#f0ebe0)',
        borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--green)', marginRight: 6 }}>{giorno.giorno}</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{giorno.giorno_breve}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {oggi && (
            <span style={{ fontSize: 9, background: 'var(--green)', color: '#fff', padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>OGGI</span>
          )}
          <TipoBadge tipo={giorno.tipo} />
        </div>
      </div>

      {/* Colazione */}
      <PastoBlock label="Colazione" orario={colazione.orario}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{giorno.colazione}</div>
        <MacroBadge kcal={colazione.macro.kcal} prot={colazione.macro.prot} />
      </PastoBlock>

      {/* Pranzo */}
      <PastoBlock label="Pranzo" orario="12:30">
        <ComponenteRiga icon="🥩" label={giorno.pranzo.proteina}
          hasAlt={getAlt('proteina', giorno.pranzo.proteina).length > 0}
          onClick={() => onOpenModal('pranzo', 'proteina')} />
        <ComponenteRiga icon="🍚" label={giorno.pranzo.fecola}
          hasAlt={getAlt('fecola', giorno.pranzo.fecola).length > 0}
          onClick={() => onOpenModal('pranzo', 'fecola')} />
        <ComponenteRiga icon="🫒" label={giorno.pranzo.grasso}
          hasAlt={getAlt('grasso', giorno.pranzo.grasso).length > 0}
          onClick={() => onOpenModal('pranzo', 'grasso')} />
        <MacroBadge kcal={giorno.pranzo.macro.kcal} prot={giorno.pranzo.macro.prot} />
      </PastoBlock>

      {/* Cena */}
      <PastoBlock label="Cena" orario="19:30" last>
        {giorno.cena.speciale === 'SAB' ? (
          <>
            <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 4 }}>{CENA_SAB.nome}</div>
            <MacroBadge kcal={CENA_SAB.macro.kcal} prot={CENA_SAB.macro.prot} />
          </>
        ) : giorno.cena.speciale === 'DOM' ? (
          <>
            <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 4 }}>{CENA_DOM.nome}</div>
            <MacroBadge kcal={CENA_DOM.macro.kcal} prot={CENA_DOM.macro.prot} />
          </>
        ) : (
          <>
            {giorno.cena.proteina && (
              <ComponenteRiga icon="🥩" label={giorno.cena.proteina}
                hasAlt={getAlt('proteina', giorno.cena.proteina).length > 0}
                onClick={() => onOpenModal('cena', 'proteina')} />
            )}
            {giorno.cena.fecola && (
              <ComponenteRiga icon="🍚" label={giorno.cena.fecola}
                hasAlt={getAlt('fecola', giorno.cena.fecola).length > 0}
                onClick={() => onOpenModal('cena', 'fecola')} />
            )}
            {giorno.cena.grasso && (
              <ComponenteRiga icon="🫒" label={giorno.cena.grasso}
                hasAlt={getAlt('grasso', giorno.cena.grasso).length > 0}
                onClick={() => onOpenModal('cena', 'grasso')} />
            )}
            <MacroBadge kcal={giorno.cena.macro.kcal} prot={giorno.cena.macro.prot} />
          </>
        )}
      </PastoBlock>

      {/* Link alla vista giornaliera */}
      <div style={{ padding: '6px 12px 8px', borderTop: '1px solid var(--line)', textAlign: 'right' }}>
        <a
          href={`/${giorno.data.slice(0, 4)}/${Number(giorno.data.slice(5, 7))}/${giorno.giorno}`}
          style={{
            fontSize: 10,
            color: 'var(--green)',
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: '.04em',
          }}
        >
          Ricette &amp; dettaglio →
        </a>
      </div>
    </div>
  );
}

function PastoBlock({ label, orario, children, last = false }: {
  label: string; orario: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{ padding: '9px 12px', borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
        letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 5,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{ fontWeight: 400 }}>{orario}</span>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// Lista della spesa
// ─────────────────────────────────────────

const CAT_ORDER = [
  'Pesce e carne','Uova','Latticini','Vegetale proteico','Pasta e cereali','Legumi',
  'Pane','Verdura e tuberi','Verdura fresca','Frutta e verdura','Frutta','Frutta secca',
  'Condimenti','Semi e frutta secca','Latticini vegetali','Cereali','Integratori',
];

function ListaSpesa({ spesa, settimane }: { spesa: Record<string, SpesaVoce>; settimane: SettimanaSpesa[] }) {
  const [settimanaFiltro, setSettimanaFiltro] = useState<string>('tutte');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [showMailPanel, setShowMailPanel] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [mailStatus, setMailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [mailError, setMailError] = useState<string>('');

  // Carica email salvata da localStorage
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('piano_mail_email');
      if (saved) setEmail(saved);
    }
  }, []);

  const spesaAttiva = useMemo(() => {
    if (settimanaFiltro === 'tutte') return spesa;
    const sett = settimane.find(s => s.wkey === settimanaFiltro);
    return sett ? sett.spesa : spesa;
  }, [settimanaFiltro, spesa, settimane]);

  const grouped = useMemo(() => {
    const groups: Record<string, [string, SpesaVoce][]> = {};
    for (const [nome, voce] of Object.entries(spesaAttiva)) {
      const cat = voce.cat || 'Altro';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push([nome, voce]);
    }
    return groups;
  }, [spesaAttiva]);

  const sortedCats = useMemo(() => {
    const cats = Object.keys(grouped);
    return cats.sort((a, b) => {
      const ai = CAT_ORDER.indexOf(a);
      const bi = CAT_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [grouped]);

  const handleSalva = async () => {
    setSaving(true);
    try {
      await fetch('/api/spesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spesa }),
      });
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleInviaMail = async () => {
    if (!email || !email.includes('@')) {
      setMailError('Inserisci un indirizzo email valido');
      return;
    }
    // Salva email in localStorage
    if (typeof window !== 'undefined') localStorage.setItem('piano_mail_email', email);

    setMailStatus('sending');
    setMailError('');
    try {
      const labelSettimana = settimanaFiltro === 'tutte'
        ? 'Tutto il mese'
        : settimane.find(s => s.wkey === settimanaFiltro)?.label ?? settimanaFiltro;

      const res = await fetch('/api/spesa/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, spesa: spesaAttiva, labelSettimana }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Errore invio');
      setMailStatus('sent');
      setTimeout(() => { setMailStatus('idle'); setShowMailPanel(false); }, 3000);
    } catch (e) {
      setMailStatus('error');
      setMailError(e instanceof Error ? e.message : 'Errore sconosciuto');
    }
  };

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, position: 'sticky', top: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Lista della spesa</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { setShowMailPanel(p => !p); setMailStatus('idle'); setMailError(''); }}
            style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 8,
              border: '1px solid var(--amber)',
              background: showMailPanel ? 'var(--amber)' : 'var(--amber-light)',
              color: showMailPanel ? '#fff' : 'var(--amber)',
              cursor: 'pointer', fontWeight: 600,
            }}>
            ✉ Invia per email
          </button>
          <button onClick={handleSalva} disabled={saving} style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 8,
            border: '1px solid var(--green)',
            background: saving ? 'var(--green-light)' : 'var(--green)',
            color: saving ? 'var(--green)' : '#fff',
            cursor: 'pointer', fontWeight: 600,
          }}>
            {saving ? 'Salvando...' : 'Salva'}
          </button>
        </div>
      </div>

      {/* ── Pannello email ── */}
      {showMailPanel && (
        <div style={{
          background: 'var(--amber-light)', border: '1px solid #f0d080',
          borderRadius: 10, padding: 12, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Invia lista spesa per email
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
            Verrà inviata la lista "{settimanaFiltro === 'tutte' ? 'Tutto il mese' : settimane.find(s => s.wkey === settimanaFiltro)?.label ?? settimanaFiltro}" con {Object.keys(spesaAttiva).length} articoli.
          </div>
          <input
            type="email"
            placeholder="La tua email (es. emanuele@email.com)"
            value={email}
            onChange={e => { setEmail(e.target.value); setMailError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleInviaMail()}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 8,
              border: mailError ? '1px solid #c0392b' : '1px solid #f0d080',
              background: '#fff', fontSize: 12, color: 'var(--ink)',
              marginBottom: 8, boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {mailError && (
            <div style={{ fontSize: 11, color: '#c0392b', marginBottom: 8 }}>{mailError}</div>
          )}
          <button
            onClick={handleInviaMail}
            disabled={mailStatus === 'sending'}
            style={{
              width: '100%', padding: '8px 0', borderRadius: 8,
              border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              background: mailStatus === 'sent' ? 'var(--green)' : 'var(--amber)',
              color: '#fff', transition: 'background .2s',
            }}
          >
            {mailStatus === 'sending' && '⟳ Invio in corso...'}
            {mailStatus === 'sent' && '✓ Email inviata!'}
            {mailStatus === 'error' && '⚠ Riprova'}
            {mailStatus === 'idle' && '✉ Invia ora'}
          </button>
        </div>
      )}


      <div style={{ marginBottom: 12 }}>
        <select value={settimanaFiltro} onChange={e => setSettimanaFiltro(e.target.value)}
          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 12, color: 'var(--ink)' }}>
          <option value="tutte">Tutto il mese</option>
          {settimane.map(s => <option key={s.wkey} value={s.wkey}>{s.label}</option>)}
        </select>
      </div>

      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {sortedCats.map(cat => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 6,
              paddingBottom: 3, borderBottom: '1px solid var(--line)',
            }}>{cat}</div>
            {grouped[cat].map(([nome, voce]) => (
              <label key={nome} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
                cursor: 'pointer', opacity: checked.has(nome) ? 0.4 : 1,
              }}>
                <input type="checkbox" checked={checked.has(nome)}
                  onChange={() => setChecked(prev => {
                    const next = new Set(prev);
                    if (next.has(nome)) next.delete(nome); else next.add(nome);
                    return next;
                  })}
                  style={{ accentColor: 'var(--green)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: 'var(--ink)' }}>{nome}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{voce.qta}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// CalendarioGrid
// ─────────────────────────────────────────

function CalendarioGrid({
  giorni, anno, mese, onOpenModal,
}: {
  giorni: GiornoPiano[]; anno: number; mese: number;
  onOpenModal: (data: string, pasto: PastoTipo, comp: ComponenteTipo) => void;
}) {
  const firstDay = new Date(anno, mese - 1, 1);
  const offset = (firstDay.getDay() + 6) % 7;

  return (
    <div className="giorni-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
      {giorni.map(g => (
        <GiornoCard key={g.data} giorno={g}
          onOpenModal={(pasto, comp) => onOpenModal(g.data, pasto, comp)} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Button helper
// ─────────────────────────────────────────

function Btn({ onClick, children, primary = false, disabled = false }: {
  onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled || undefined} style={{
      padding: '7px 12px', borderRadius: 9, border: '1px solid var(--line)',
      background: primary ? 'var(--green)' : 'var(--paper)',
      color: primary ? '#fff' : 'var(--green)',
      cursor: disabled ? 'default' : 'pointer', fontSize: 12, fontFamily: 'inherit',
      fontWeight: 600, opacity: disabled ? 0.6 : 1, transition: 'all .15s',
    }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────

export function PianoMensileClient({ anno, mese }: Props) {
  const router = useRouter();
  const [piano, setPiano] = useState<PianoMese | null>(null);
  const [spesa, setSpesa] = useState<Record<string, SpesaVoce>>({});
  const [settimane, setSettimane] = useState<SettimanaSpesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [activeTab, setActiveTab] = useState<'piano' | 'spesa'>('piano');
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [ricalcolo, setRicalcolo] = useState(false);

  // Profilo e fase — caricati da localStorage (cache rapida) all'avvio
  const iniziale = useProfiloIniziale();
  const [profilo, setProfilo] = useState<Profilo>(iniziale.profilo);
  const [fase, setFase] = useState<Fase>(iniziale.fase);

  const handleProfiloChange = useCallback((newProfilo: Profilo, newFase: Fase) => {
    const faseChanged = newFase.id !== fase.id;
    setProfilo(newProfilo);
    setFase(newFase);
    if (faseChanged) {
      // Rigenera il piano se la fase cambia (preferenze diversi alimenti)
      // handleRigenera non è ancora definita qui, usiamo una ref lazy
      setTimeout(() => handleRigeneraRef.current?.(), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase.id]);

  // Ref per evitare dipendenza circolare con handleRigenera
  const handleRigeneraRef = React.useRef<(() => void) | undefined>(undefined);

  const nomeMese = NOME_MESI_IT[mese];

  const caricaPiano = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/piano?anno=${anno}&mese=${mese}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPiano(data.piano);
      setSpesa(data.spesa);
      setSettimane(data.settimane ?? []);
      setSyncStatus('saved');
    } catch (e) {
      setError('Errore nel caricamento del piano. Riprova.');
      console.error(e);
    } finally {
      setLoading(false); }
  }, [anno, mese]);

  useEffect(() => { caricaPiano(); }, [caricaPiano]);

  const handleRigenera = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/genera', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anno, mese }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPiano(data.piano);
      setSpesa(data.spesa);
      setSettimane(data.settimane ?? []);
      setSyncStatus('saved');
    } catch (e) {
      setSyncStatus('error');
      console.error(e);
    }
  }, [anno, mese]);

  // Registra handleRigenera nella ref per uso da handleProfiloChange
  useEffect(() => {
    handleRigeneraRef.current = handleRigenera;
  }, [handleRigenera]);

  const navMese = (delta: number) => {
    let m = mese + delta, a = anno;
    if (m < 1) { m = 12; a -= 1; }
    if (m > 12) { m = 1; a += 1; }
    router.push(`/${a}/${m}`);
  };

  // Apri modal variante
  const handleOpenModal = (data: string, pasto: PastoTipo, comp: ComponenteTipo) => {
    if (!piano) return;
    const giorno = piano[data];
    const corrente = pasto === 'pranzo' ? giorno.pranzo[comp] : giorno.cena[comp];
    if (!corrente) return;
    const alternative = getAlt(comp, corrente);
    setModal({ data, pasto, componente: comp, corrente, alternative });
  };

  // Sostituisce un componente nel piano e ricalcola i macro
  const handleSostituisci = async (nuova: string) => {
    if (!modal || !piano) return;
    setModal(null);
    setRicalcolo(true);

    const pianoAggiornato: PianoMese = { ...piano };
    const giorno = { ...pianoAggiornato[modal.data] };

    if (modal.pasto === 'pranzo') {
      const pranzo = { ...giorno.pranzo, [modal.componente]: nuova };
      pranzo.macro = calcolaMacroFront(pranzo.proteina, pranzo.fecola, pranzo.grasso);
      giorno.pranzo = pranzo;
    } else {
      const cena = { ...giorno.cena, [modal.componente]: nuova };
      if (!cena.speciale) {
        cena.macro = calcolaMacroFront(cena.proteina!, cena.fecola!, cena.grasso!);
      }
      giorno.cena = cena;
    }

    pianoAggiornato[modal.data] = giorno;
    setPiano(pianoAggiornato);

    // Salva su Sheets in background
    setSyncStatus('syncing');
    try {
      await fetch('/api/genera', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anno, mese, piano: pianoAggiornato }),
      });
      setSyncStatus('saved');
    } catch {
      setSyncStatus('error');
    } finally {
      setRicalcolo(false);
    }
  };

  const giorni = piano ? Object.values(piano).sort((a, b) => a.giorno - b.giorno) : [];

  const syncLabel = { idle: '', syncing: '⟳ Sincronizzando...', saved: '✓ Salvato su Sheets', error: '⚠ Errore sync' }[syncStatus];
  const syncColor = { idle: 'var(--muted)', syncing: 'var(--amber)', saved: 'var(--green)', error: '#c0392b' }[syncStatus];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Stili responsive ── */}
      <style>{`
        .piano-layout { display: grid; grid-template-columns: 1fr 300px; gap: 12px; align-items: start; }
        .bottom-nav { display: none; }
        .top-tabs { display: none; }
        .giorni-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        .giorni-list { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        .spesa-block { display: block; }
        .piano-block { display: block; }
        @media (max-width: 900px) {
          .piano-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .bottom-nav { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
            background: var(--paper); border-top: 1.5px solid var(--line);
            padding-bottom: env(safe-area-inset-bottom, 8px); }
          .giorni-list { grid-template-columns: 1fr !important; gap: 8px !important; }
          body { padding-bottom: 80px; }
          .header-actions { flex-direction: column !important; align-items: flex-start !important; }
          .mese-nav { flex-wrap: nowrap !important; }
        }
        @media (min-width: 769px) {
          .piano-block { display: block !important; }
          .spesa-block { display: block !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: 'linear-gradient(135deg,#fffdf8,#eef5ee)',
        borderBottom: '1px solid var(--line)', padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(26,40,32,.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1500, margin: '0 auto' }}>
          {/* Top row: titolo + mese nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              🌿 Piano Serafino
            </h1>
            <div className="mese-nav" style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              <Btn onClick={() => navMese(-1)}>←</Btn>
              <span style={{ padding: '6px 12px', background: 'var(--green)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {nomeMese} {anno}
              </span>
              <Btn onClick={() => navMese(1)}>→</Btn>
              <Btn onClick={handleRigenera} primary disabled={loading}>↺</Btn>
            </div>
          </div>
          {/* Bottom row: profilo + sync */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <ProfiloSelector profilo={profilo} fase={fase} onChange={handleProfiloChange} />
            {syncStatus !== 'idle' && (
              <span style={{ fontSize: 10, color: syncColor, whiteSpace: 'nowrap' }}>{syncLabel}</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Bottom nav mobile ── */}
      <div className="bottom-nav">
        {(['piano', 'spesa'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '12px 0 10px', fontWeight: 700, fontSize: 13,
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 3,
            color: activeTab === tab ? 'var(--green)' : 'var(--muted)',
          }}>
            <span style={{ fontSize: 20 }}>{tab === 'piano' ? '📅' : '🛒'}</span>
            <span style={{ fontSize: 11 }}>{tab === 'piano' ? 'Piano' : 'Spesa'}</span>
            {activeTab === tab && <div style={{ width: 24, height: 2, background: 'var(--green)', borderRadius: 99, marginTop: 2 }} />}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
            <div style={{ fontSize: 32 }}>⟳</div>
            <div style={{ marginTop: 8 }}>Caricamento piano {nomeMese} {anno}...</div>
          </div>
        ) : error ? (
          <div style={{ background: '#fdeaea', border: '1px solid #c0392b', borderRadius: 12, padding: 20, color: '#c0392b', textAlign: 'center' }}>
            {error}
            <button onClick={caricaPiano} style={{ display: 'block', margin: '12px auto 0', padding: '6px 16px', cursor: 'pointer' }}>Riprova</button>
          </div>
        ) : (
          <div className="piano-layout">
            {/* Piano */}
            <div className="piano-block" style={{ display: activeTab === 'piano' ? 'block' : 'none' }}>
              <div className="giorni-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                {['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map(g => (
                  <div key={g} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--muted)', padding: '4px 0' }}>{g}</div>
                ))}
              </div>
              <CalendarioGrid giorni={giorni} anno={anno} mese={mese} onOpenModal={handleOpenModal} />

              {/* Hint mobile */}
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--green-light)', borderRadius: 8, fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
                Tocca una proteina, feculento o grasso (↕) per cambiarlo
              </div>
            </div>

            {/* Spesa */}
            <div className="spesa-block" style={{ display: activeTab === 'spesa' ? 'block' : 'none' }}>
              <ListaSpesa spesa={spesa} settimane={settimane} />
            </div>
          </div>
        )}
      </div>

      {/* ── Modal variante ── */}
      {modal && piano && (
        <ModalVariante
          modal={modal}
          piano={piano}
          onClose={() => setModal(null)}
          onSostituisci={handleSostituisci}
        />
      )}
    </div>
  );
}

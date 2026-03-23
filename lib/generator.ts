import {
  PROTEINE,
  FECULENTI,
  GRASSI,
  COLAZIONI,
  CENA_SAB,
  CENA_DOM,
  TIPO_GIORNO_MAP,
  GIORNI_BREVI,
  GIORNI_LUNGHI,
  MESI_BREVI,
} from './data';
import { ceil } from './utils';

export interface GiornoPiano {
  data: string;
  giorno: number;
  giorno_nome: string;
  giorno_breve: string;
  tipo: 'LMV' | 'MT' | 'SAB' | 'DOM';
  colazione: string;
  pranzo: {
    proteina: string;
    fecola: string;
    grasso: string;
    macro: { kcal: number; prot: number };
  };
  cena: {
    speciale: 'SAB' | 'DOM' | null;
    proteina: string | null;
    fecola: string | null;
    grasso: string | null;
    macro: { kcal: number; prot: number };
  };
  eccezione: boolean;
  note_eccezione: string;
}

export type PianoMese = Record<string, GiornoPiano>;

export interface SpesaVoce {
  qta: string;
  cat: string;
  totale: number;
  u: string;
}

export interface SettimanaSpesa {
  wkey: string;
  label: string;
  dal: string;
  al: string;
  spesa: Record<string, SpesaVoce>;
}

// ─────────────────────────────────────────
// Selezione random (identica al Python)
// ─────────────────────────────────────────

function scegliProteina(escludi1?: string | null, escludi2?: string | null): string {
  const opzioni = Object.keys(PROTEINE).filter(p => p !== escludi1 && p !== escludi2);
  return opzioni[Math.floor(Math.random() * opzioni.length)];
}

function scegliFecula(escludi: string[] = []): string {
  const opzioni = Object.keys(FECULENTI).filter(f => !escludi.includes(f));
  return opzioni[Math.floor(Math.random() * opzioni.length)];
}

function scegliGrasso(tipoProteina: 'magra' | 'grassa', escludi: string[] = []): string {
  let opzioni = Object.keys(GRASSI).filter(g => !escludi.includes(g));
  if (tipoProteina === 'grassa') {
    const leggeri = opzioni.filter(g => GRASSI[g].kcal <= 90);
    if (leggeri.length > 0) opzioni = leggeri;
  }
  return opzioni[Math.floor(Math.random() * opzioni.length)];
}

function calcolaMacro(protId: string, fecId: string, grasId: string): { kcal: number; prot: number } {
  const p = PROTEINE[protId] ?? { kcal: 0, prot: 0 };
  const f = FECULENTI[fecId] ?? { kcal: 0, prot: 0 };
  const g = GRASSI[grasId] ?? { kcal: 0, prot: 0 };
  return {
    kcal: p.kcal + f.kcal + g.kcal + 50,  // +50 verdure
    prot: p.prot + f.prot + g.prot + 3,    // +3 verdure
  };
}

// ─────────────────────────────────────────
// Genera piano mensile
// ─────────────────────────────────────────

function getDaysInMonth(anno: number, mese: number): number {
  return new Date(anno, mese, 0).getDate();
}

function getWeekday(anno: number, mese: number, giorno: number): number {
  // Returns 0=Monday, 6=Sunday (JS Date uses 0=Sunday, so we adjust)
  const d = new Date(anno, mese - 1, giorno);
  return (d.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
}

function toIsoString(anno: number, mese: number, giorno: number): string {
  const m = String(mese).padStart(2, '0');
  const g = String(giorno).padStart(2, '0');
  return `${anno}-${m}-${g}`;
}

export function generaMese(anno: number, mese: number): PianoMese {
  const numGiorni = getDaysInMonth(anno, mese);
  const piano: PianoMese = {};
  const proteineUsate: string[] = [];

  for (let g = 1; g <= numGiorni; g++) {
    const weekday = getWeekday(anno, mese, g);
    const tipo = TIPO_GIORNO_MAP[weekday];

    const protPranzo = scegliProteina(
      proteineUsate.length > 0 ? proteineUsate[proteineUsate.length - 1] : null,
      proteineUsate.length >= 2 ? proteineUsate[proteineUsate.length - 2] : null,
    );

    const protCena = scegliProteina(
      protPranzo,
      proteineUsate.length > 0 ? proteineUsate[proteineUsate.length - 1] : null,
    );

    const fecPranzo = scegliFecula([]);
    const fecCena = scegliFecula([fecPranzo]);
    const grasPranzo = scegliGrasso(PROTEINE[protPranzo].tipo);
    const grasCena = scegliGrasso(PROTEINE[protCena].tipo, [grasPranzo]);

    proteineUsate.push(protPranzo);
    proteineUsate.push(protCena);

    const cenaSpeciale: 'SAB' | 'DOM' | null =
      tipo === 'SAB' ? 'SAB' : tipo === 'DOM' ? 'DOM' : null;

    const dataStr = toIsoString(anno, mese, g);

    piano[dataStr] = {
      data: dataStr,
      giorno: g,
      giorno_nome: GIORNI_LUNGHI[weekday],
      giorno_breve: GIORNI_BREVI[weekday],
      tipo,
      colazione: COLAZIONI[tipo].nome,
      pranzo: {
        proteina: protPranzo,
        fecola: fecPranzo,
        grasso: grasPranzo,
        macro: calcolaMacro(protPranzo, fecPranzo, grasPranzo),
      },
      cena: {
        speciale: cenaSpeciale,
        proteina: cenaSpeciale ? null : protCena,
        fecola: cenaSpeciale ? null : fecCena,
        grasso: cenaSpeciale ? null : grasCena,
        macro: cenaSpeciale
          ? cenaSpeciale === 'SAB' ? CENA_SAB.macro : CENA_DOM.macro
          : calcolaMacro(protCena, fecCena, grasCena),
      },
      eccezione: false,
      note_eccezione: '',
    };
  }

  return piano;
}

// ─────────────────────────────────────────
// Lista della spesa
// ─────────────────────────────────────────

type SpesaAccumulator = Record<string, { totale: number; u: string; cat: string }>;

function aggiungiComponente(
  spesa: SpesaAccumulator,
  db: typeof PROTEINE | typeof FECULENTI | typeof GRASSI,
  key: string
): void {
  if (!(key in db)) return;
  const v = (db as Record<string, { q: number; u: string; cat_spesa: string }>)[key];
  if (!spesa[key]) spesa[key] = { totale: 0, u: v.u, cat: v.cat_spesa };
  spesa[key].totale += v.q;
  spesa[key].u = v.u;
  spesa[key].cat = v.cat_spesa;
}

function addSpesa(spesa: SpesaAccumulator, nome: string, q: number, u: string, cat: string): void {
  if (!spesa[nome]) spesa[nome] = { totale: 0, u, cat };
  spesa[nome].totale += q;
  spesa[nome].u = u;
  spesa[nome].cat = cat;
}

function formattaQta(tot: number, u: string): string {
  if (u === 'g') {
    if (tot >= 1000) {
      const kg = tot / 1000;
      return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
    }
    return `${ceil(tot / 50) * 50} g`;
  } else if (u === 'ml') {
    if (tot >= 1000) {
      const l = tot / 1000;
      return l % 1 === 0 ? `${l} L` : `${l.toFixed(1)} L`;
    }
    return `${ceil(tot / 100) * 100} ml`;
  } else if (u === 'pz') {
    return `${Math.round(tot)} pz`;
  }
  return `${tot} ${u}`;
}

export function calcolaSpesa(piano: PianoMese): Record<string, SpesaVoce> {
  const spesa: SpesaAccumulator = {};

  for (const dati of Object.values(piano)) {
    const tipo = dati.tipo;
    const col = COLAZIONI[tipo];

    // Colazione
    for (const [ingr, v] of Object.entries(col.spesa)) {
      addSpesa(spesa, ingr, v.q, v.u, v.cat);
    }

    // Spuntino mattina: frutta
    addSpesa(spesa, 'Frutta fresca', 150, 'g', 'Frutta');

    // Pranzo
    const pr = dati.pranzo;
    aggiungiComponente(spesa, PROTEINE, pr.proteina);
    aggiungiComponente(spesa, FECULENTI, pr.fecola);
    aggiungiComponente(spesa, GRASSI, pr.grasso);
    addSpesa(spesa, 'Verdure miste', 300, 'g', 'Verdura fresca');

    // Shake
    addSpesa(spesa, 'Whey protein', 30, 'g', 'Integratori');
    addSpesa(spesa, 'Creatina', 5, 'g', 'Integratori');

    // Gouter
    addSpesa(spesa, 'Cottage cheese', 100, 'g', 'Latticini');
    addSpesa(spesa, 'Oleaginosi', 30, 'g', 'Semi e frutta secca');
    addSpesa(spesa, 'Crudités', 150, 'g', 'Verdura fresca');

    // Cena
    const ce = dati.cena;
    if (ce.speciale === 'SAB') {
      addSpesa(spesa, 'Pasta integrale / di legumi cotta', 200, 'g', 'Pasta e cereali');
      addSpesa(spesa, 'Formaggio grattugiato', 25, 'g', 'Latticini');
    } else if (ce.speciale === 'DOM') {
      addSpesa(spesa, 'Fagioli rossi/bianchi/neri cotti', 190, 'g', 'Legumi');
      addSpesa(spesa, 'Patate / patata dolce cotte', 150, 'g', 'Verdura e tuberi');
    } else {
      if (ce.proteina) aggiungiComponente(spesa, PROTEINE, ce.proteina);
      if (ce.fecola) aggiungiComponente(spesa, FECULENTI, ce.fecola);
      if (ce.grasso) aggiungiComponente(spesa, GRASSI, ce.grasso);
    }

    addSpesa(spesa, 'Verdure miste', 300, 'g', 'Verdura fresca');
  }

  // Formatta
  const risultato: Record<string, SpesaVoce> = {};
  for (const [ingr, v] of Object.entries(spesa)) {
    risultato[ingr] = {
      qta: formattaQta(v.totale, v.u),
      cat: v.cat,
      totale: Math.round(v.totale),
      u: v.u,
    };
  }

  return risultato;
}

// ─────────────────────────────────────────
// Spesa per settimane
// ─────────────────────────────────────────

function getISOWeek(dateStr: string): { year: number; week: number } {
  const d = new Date(dateStr);
  const thursday = new Date(d);
  thursday.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const year = thursday.getFullYear();
  const startOfYear = new Date(year, 0, 4);
  const week = Math.ceil(
    ((thursday.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return { year, week };
}

export function calcolaSpesaSettimane(
  piano: PianoMese,
  _anno: number,
  _mese: number
): SettimanaSpesa[] {
  const weeks: Record<string, Record<string, GiornoPiano>> = {};

  for (const [isoStr, d] of Object.entries(piano).sort(([a], [b]) => a.localeCompare(b))) {
    const { year, week } = getISOWeek(isoStr);
    const wkey = `${year}-W${String(week).padStart(2, '0')}`;
    if (!weeks[wkey]) weeks[wkey] = {};
    weeks[wkey][isoStr] = d;
  }

  const result: SettimanaSpesa[] = [];

  for (const [wkey, weekPiano] of Object.entries(weeks)) {
    const spesa = calcolaSpesa(weekPiano);
    const dates = Object.keys(weekPiano).sort();
    const dtDal = dates[0];
    const dtAl = dates[dates.length - 1];
    const dDal = new Date(dtDal);
    const dAl = new Date(dtAl);
    const label = `${dDal.getDate()} ${MESI_BREVI[dDal.getMonth() + 1]} – ${dAl.getDate()} ${MESI_BREVI[dAl.getMonth() + 1]}`;
    result.push({ wkey, label, dal: dtDal, al: dtAl, spesa });
  }

  return result;
}

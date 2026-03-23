export interface Profilo {
  id: string;           // uuid o slug (es. "emanuele")
  nome: string;
  cognome?: string;
  peso_kg: number;
  altezza_cm: number;
  eta: number;
  sesso: 'M' | 'F';
  nutrizionista?: string;  // es. "Serafino"
  fase_attiva: FaseId;
  creato_il: string;    // ISO date
}

export type FaseId = 'dimagrimento' | 'mantenimento' | 'massa';

export interface Fase {
  id: FaseId;
  nome: string;
  descrizione: string;
  icona: string;         // emoji
  colore: string;        // hex
  // Calcolo macro
  prot_per_kg: number;       // es. 2.2
  kcal_pasto: number;        // target kcal per pasto principale
  prot_pasto: number;        // target g proteine per pasto
  // Preferenze generatore
  preferisce_grassi_leggeri: boolean;  // se true filtra grassi kcal<=90
  limita_feculenti_densi: boolean;     // se true evita patate/polenta/pane
  moltiplicatore_porzioni: number;     // 0.85 dimagrimento, 1.0 mant, 1.2 massa
}

export const FASI: Record<FaseId, Fase> = {
  dimagrimento: {
    id: 'dimagrimento',
    nome: 'Dimagrimento',
    descrizione: 'Riduzione calorica controllata, massimizzazione proteine',
    icona: '📉',
    colore: '#e67e22',
    prot_per_kg: 2.2,
    kcal_pasto: 530,
    prot_pasto: 58,
    preferisce_grassi_leggeri: true,
    limita_feculenti_densi: true,
    moltiplicatore_porzioni: 0.85,
  },
  mantenimento: {
    id: 'mantenimento',
    nome: 'Mantenimento',
    descrizione: 'Piano equilibrato Serafino',
    icona: '⚖️',
    colore: '#4f7a54',
    prot_per_kg: 2.0,
    kcal_pasto: 620,
    prot_pasto: 53,
    preferisce_grassi_leggeri: false,
    limita_feculenti_densi: false,
    moltiplicatore_porzioni: 1.0,
  },
  massa: {
    id: 'massa',
    nome: 'Massa muscolare',
    descrizione: 'Surplus calorico con proteine elevate',
    icona: '💪',
    colore: '#1a6b9a',
    prot_per_kg: 1.8,
    kcal_pasto: 740,
    prot_pasto: 60,
    preferisce_grassi_leggeri: false,
    limita_feculenti_densi: false,
    moltiplicatore_porzioni: 1.2,
  },
};

// Profilo default Emanuele
export const PROFILO_DEFAULT: Profilo = {
  id: 'emanuele',
  nome: 'Emanuele',
  cognome: 'Ripiccini',
  peso_kg: 87.38,
  altezza_cm: 178,
  eta: 38,
  sesso: 'M',
  nutrizionista: 'Serafino',
  fase_attiva: 'mantenimento',
  creato_il: '2026-01-01',
};

// Calcola target giornaliero in base a profilo + fase
export function calcolaTarget(profilo: Profilo, fase: Fase) {
  const prot_giorno = Math.round(profilo.peso_kg * fase.prot_per_kg);
  return {
    prot_giorno,
    kcal_pasto: fase.kcal_pasto,
    prot_pasto: fase.prot_pasto,
    kcal_giorno: fase.kcal_pasto * 2 + 400 + 180 + 90, // pranzo+cena+colazione+spuntini+shake
  };
}

// ═══════════════════════════════════════════════════════
// DATI PIANO ALIMENTARE - Emanuele RIPICCINI
// Portato da meal_planner.py
// ═══════════════════════════════════════════════════════

export interface Proteina {
  q_str: string;
  q: number;
  u: string;
  prot: number;
  kcal: number;
  tipo: 'magra' | 'grassa';
  cat_spesa: string;
  note: string;
  alt: string[];
}

export interface Feculento {
  q_str: string;
  q: number;
  u: string;
  prot: number;
  kcal: number;
  cat_spesa: string;
  note: string;
  alt: string[];
}

export interface Grasso {
  q_str: string;
  q: number;
  u: string;
  prot: number;
  kcal: number;
  cat_spesa: string;
  note: string;
  alt: string[];
}

export interface OpzioneColazione {
  nome: string;
  descr: string;
  prot: number;
  kcal: number;
}

export interface SpesaItem {
  q: number;
  u: string;
  cat: string;
}

export interface Colazione {
  nome: string;
  orario: string;
  componenti: string[];
  opzioni: OpzioneColazione[];
  spesa: Record<string, SpesaItem>;
  macro: { prot: number; kcal: number };
  nota?: string;
}

export interface CenaSpeciale {
  nome: string;
  componenti: string[];
  macro: { prot: number; kcal: number };
  entrée?: string;
}

// ═══════════════════════════════════════════════════════
// PROTEINE (13)
// ═══════════════════════════════════════════════════════

export const PROTEINE: Record<string, Proteina> = {
  "Tonno al naturale": {
    q_str: "160g", q: 160, u: "g",
    prot: 46, kcal: 160, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "In lattina, sgocciolato e asciugato",
    alt: ["Merluzzo salato secco", "Gamberi / scampi", "Petto di pollo"]
  },
  "Petto di pollo / tacchino": {
    q_str: "200g", q: 200, u: "g",
    prot: 44, kcal: 220, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Griglia, vapore o forno. Marinare con limone e erbe.",
    alt: ["Prosciutto cotto", "Viande des Grisons", "Tonno al naturale"]
  },
  "Salmone affumicato sockeye": {
    q_str: "200g", q: 200, u: "g",
    prot: 40, kcal: 280, tipo: "grassa",
    cat_spesa: "Pesce e carne",
    note: "⚠️ Proteina grassa → ridurre/eliminare fonte di grasso aggiuntiva",
    alt: ["Tonno al naturale", "Sgombro al naturale", "Salmone fresco"]
  },
  "Uova grandi (L)": {
    q_str: "4 pz + 2 albumi", q: 4, u: "pz",
    prot: 28, kcal: 280, tipo: "grassa",
    cat_spesa: "Uova",
    note: "⚠️ Proteina grassa → ridurre fonte di grasso aggiuntiva",
    alt: ["Cottage cheese", "Frittata al forno", "Uova strapazzate"]
  },
  "Cottage cheese": {
    q_str: "400g", q: 400, u: "g",
    prot: 48, kcal: 280, tipo: "magra",
    cat_spesa: "Latticini",
    note: "Opzione versatile, si abbina a verdure o frutta",
    alt: ["Skyr / séré maigre", "Fiocchi di latte magri", "Tofu"]
  },
  "Tofu": {
    q_str: "200g", q: 200, u: "g",
    prot: 20, kcal: 160, tipo: "magra",
    cat_spesa: "Vegetale proteico",
    note: "Marinare con salsa soia + aglio. Rosolare bene.",
    alt: ["Edamame", "Tempeh", "Cottage cheese"]
  },
  "Viande des Grisons (bresaola)": {
    q_str: "100g", q: 100, u: "g",
    prot: 32, kcal: 140, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Affettato magro svizzero, ottimo freddo in insalata",
    alt: ["Prosciutto cotto", "Petto di tacchino affettato", "Tonno al naturale"]
  },
  "Prosciutto cotto": {
    q_str: "200g", q: 200, u: "g",
    prot: 36, kcal: 280, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Qualità alta, senza additivi (es. IGP)",
    alt: ["Viande des Grisons", "Petto di pollo / tacchino", "Tonno al naturale"]
  },
  "Merluzzo salato secco": {
    q_str: "100g", q: 100, u: "g",
    prot: 47, kcal: 190, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Ammollare 24-48h cambiando acqua ogni 8h",
    alt: ["Tonno al naturale", "Platessa al vapore", "Gamberi / scampi"]
  },
  "Edamame (fagioli di soia)": {
    q_str: "200g", q: 200, u: "g",
    prot: 26, kcal: 280, tipo: "magra",
    cat_spesa: "Vegetale proteico",
    note: "Surgelati, vapore 5 min. Ottimi con salsa soia.",
    alt: ["Tofu", "Lenticchie", "Cottage cheese"]
  },
  "Gamberi / scampi": {
    q_str: "200g", q: 200, u: "g",
    prot: 40, kcal: 180, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Saltare in padella con aglio e prezzemolo.",
    alt: ["Tonno al naturale", "Merluzzo salato secco", "Calamari"]
  },
  "Sgombro al naturale": {
    q_str: "200g", q: 200, u: "g",
    prot: 38, kcal: 300, tipo: "grassa",
    cat_spesa: "Pesce e carne",
    note: "⚠️ Proteina grassa → ridurre fonte di grasso aggiuntiva",
    alt: ["Tonno al naturale", "Salmone affumicato sockeye", "Sardine"]
  },
  "Carne manzo magra": {
    q_str: "200g", q: 200, u: "g",
    prot: 44, kcal: 260, tipo: "magra",
    cat_spesa: "Pesce e carne",
    note: "Scelte magre: filetto, fesa, noce. Griglia o forno.",
    alt: ["Petto di pollo / tacchino", "Tonno al naturale", "Prosciutto cotto"]
  },
};

// ═══════════════════════════════════════════════════════
// FECULENTI (10)
// ═══════════════════════════════════════════════════════

export const FECULENTI: Record<string, Feculento> = {
  "Pasta integrale / di legumi cotta": {
    q_str: "150g (cotta)", q: 150, u: "g",
    prot: 7, kcal: 180, cat_spesa: "Pasta e cereali",
    note: "150g cotta = ~60g cruda. Preferire pasta di legumi per +proteine.",
    alt: ["Riso integrale cotto", "Quinoa / farro / orzo cotti", "Polenta cotta"],
  },
  "Riso integrale cotto": {
    q_str: "150g (cotto)", q: 150, u: "g",
    prot: 4, kcal: 180, cat_spesa: "Pasta e cereali",
    note: "150g cotto = ~60g crudo. Cuocere in brodo vegetale.",
    alt: ["Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti", "Polenta cotta"],
  },
  "Patate / patata dolce cotte": {
    q_str: "200g (cotte)", q: 200, u: "g",
    prot: 4, kcal: 170, cat_spesa: "Verdura e tuberi",
    note: "Forno, vapore o bollite. No fritte.",
    alt: ["Riso integrale cotto", "Mais in chicchi cotto", "Castagne cotte"],
  },
  "Lenticchie cotte": {
    q_str: "180g (cotte)", q: 180, u: "g",
    prot: 18, kcal: 200, cat_spesa: "Legumi",
    note: "Anche fonte proteica! Ottimo con curcuma e spezie.",
    alt: ["Fagioli rossi/bianchi/neri cotti", "Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti"],
  },
  "Pane integrale": {
    q_str: "75g", q: 75, u: "g",
    prot: 9, kcal: 185, cat_spesa: "Pane",
    note: "Scegliere pane con <5% zuccheri. Farro o segale.",
    alt: ["Riso integrale cotto", "Pasta integrale / di legumi cotta", "Patate / patata dolce cotte"],
  },
  "Polenta cotta": {
    q_str: "240g (cotta)", q: 240, u: "g",
    prot: 5, kcal: 200, cat_spesa: "Pasta e cereali",
    note: "240g cotta = ~60g farina di mais. Con funghi o verdure.",
    alt: ["Riso integrale cotto", "Quinoa / farro / orzo cotti", "Patate / patata dolce cotte"],
  },
  "Fagioli rossi/bianchi/neri cotti": {
    q_str: "150g (cotti)", q: 150, u: "g",
    prot: 12, kcal: 175, cat_spesa: "Legumi",
    note: "Anche fonte proteica. In lattina o secchi.",
    alt: ["Lenticchie cotte", "Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti"],
  },
  "Castagne cotte": {
    q_str: "100g", q: 100, u: "g",
    prot: 3, kcal: 200, cat_spesa: "Frutta secca",
    note: "Stagionale (autunno/inverno). Ottimo con formaggi.",
    alt: ["Patate / patata dolce cotte", "Riso integrale cotto", "Mais in chicchi cotto"],
  },
  "Mais in chicchi cotto": {
    q_str: "165g", q: 165, u: "g",
    prot: 5, kcal: 180, cat_spesa: "Verdura e tuberi",
    note: "In lattina o surgelato. Ottimo in insalata.",
    alt: ["Patate / patata dolce cotte", "Riso integrale cotto", "Quinoa / farro / orzo cotti"],
  },
  "Quinoa / farro / orzo cotti": {
    q_str: "150g (cotti)", q: 150, u: "g",
    prot: 7, kcal: 185, cat_spesa: "Pasta e cereali",
    note: "150g cotto. Ottimo in insalata fredda.",
    alt: ["Riso integrale cotto", "Pasta integrale / di legumi cotta", "Polenta cotta"],
  },
};

// ═══════════════════════════════════════════════════════
// GRASSI (13)
// ═══════════════════════════════════════════════════════

export const GRASSI: Record<string, Grasso> = {
  "Olio d'oliva EVO": {
    q_str: "10g (1 CAS)", q: 10, u: "g",
    prot: 0, kcal: 90, cat_spesa: "Condimenti",
    note: "Misurare con cucchiaio per precisione.",
    alt: ["Avocado", "Olive (18 unità)", "Semi misti"],
  },
  "Avocado": {
    q_str: "~75g (1/2 avocado)", q: 75, u: "g",
    prot: 1, kcal: 120, cat_spesa: "Frutta e verdura",
    note: "A fette su insalata o schiacciato come base.",
    alt: ["Olio d'oliva EVO", "Hummus (1 CAS grande)", "Oleaginosi"],
  },
  "Semi misti": {
    q_str: "15g (1.5 CAS)", q: 15, u: "g",
    prot: 3, kcal: 90, cat_spesa: "Semi e frutta secca",
    note: "Mix: chia, lino, zucca, girasole.",
    alt: ["Oleaginosi", "Burro di arachidi 100%", "Olio d'oliva EVO"],
  },
  "Olive (18 unità)": {
    q_str: "54g (~18 olive)", q: 54, u: "g",
    prot: 0, kcal: 75, cat_spesa: "Condimenti",
    note: "Denocciolate. In insalata o come goûter.",
    alt: ["Avocado", "Oleaginosi", "Olio d'oliva EVO"],
  },
  "Formaggio grattugiato": {
    q_str: "25g", q: 25, u: "g",
    prot: 5, kcal: 90, cat_spesa: "Latticini",
    note: "Parmigiano, gruyère, emmental. Su pasta o verdure.",
    alt: ["Mozzarella", "Ricotta / sérac", "Pesto"],
  },
  "Oleaginosi": {
    q_str: "15g (1 manciata)", q: 15, u: "g",
    prot: 3, kcal: 90, cat_spesa: "Semi e frutta secca",
    note: "Noci, mandorle, anacardi. Una piccola manciata.",
    alt: ["Semi misti", "Burro di arachidi 100%", "Avocado"],
  },
  "Burro di arachidi 100%": {
    q_str: "15g (1 CAS)", q: 15, u: "g",
    prot: 4, kcal: 90, cat_spesa: "Condimenti",
    note: "Solo 100% arachidi, zero zuccheri aggiunti.",
    alt: ["Oleaginosi", "Semi misti", "Avocado"],
  },
  "Crème à cuisiner allégée": {
    q_str: "90g", q: 90, u: "g",
    prot: 3, kcal: 90, cat_spesa: "Latticini",
    note: "Per salse cremose. Verificare % grassi (<15%).",
    alt: ["Ricotta / sérac", "Formaggio grattugiato", "Olio d'oliva EVO"],
  },
  "Latte di cocco allégé": {
    q_str: "95ml", q: 95, u: "ml",
    prot: 1, kcal: 90, cat_spesa: "Latticini vegetali",
    note: "In lattina. Per curry o piatti esotici.",
    alt: ["Crème à cuisiner allégée", "Olio d'oliva EVO", "Ricotta / sérac"],
  },
  "Hummus (1 CAS grande)": {
    q_str: "60g (1 CAS grande)", q: 60, u: "g",
    prot: 3, kcal: 90, cat_spesa: "Condimenti",
    note: "Anche come spuntino o base per verdure.",
    alt: ["Avocado", "Oleaginosi", "Burro di arachidi 100%"],
  },
  "Mozzarella": {
    q_str: "40g", q: 40, u: "g",
    prot: 3, kcal: 100, cat_spesa: "Latticini",
    note: "Con insalata, pasta o come goûter.",
    alt: ["Formaggio grattugiato", "Ricotta / sérac", "Crème à cuisiner allégée"],
  },
  "Ricotta / sérac": {
    q_str: "50g", q: 50, u: "g",
    prot: 4, kcal: 90, cat_spesa: "Latticini",
    note: "Su verdure, pane o come condimento pasta.",
    alt: ["Mozzarella", "Formaggio grattugiato", "Crème à cuisiner allégée"],
  },
  "Pesto": {
    q_str: "25g (1 CAS)", q: 25, u: "g",
    prot: 2, kcal: 100, cat_spesa: "Condimenti",
    note: "Pesto genovese classico o di rucola.",
    alt: ["Olio d'oliva EVO", "Formaggio grattugiato", "Hummus (1 CAS grande)"],
  },
};

// ═══════════════════════════════════════════════════════
// COLAZIONI FISSE PER TIPO DI GIORNO
// ═══════════════════════════════════════════════════════

export const COLAZIONI: Record<string, Colazione> = {
  "LMV": {
    nome: "Colazione con uova (con tempo)",
    orario: "07:00",
    componenti: [
      "2 uova grandi (L) + 2 albumi",
      "100g cottage cheese",
      "½ avocado  OPPURE  1 CAS grande hummus",
      "max 1 cac olio d'oliva per cottura (meno = meglio)",
    ],
    opzioni: [
      { nome: "Uova strapazzate classiche", descr: "2 uova + 2 albumi + 100g cottage cheese + ½ avocado o hummus", prot: 35, kcal: 400 },
      { nome: "Frittata di verdure al forno", descr: "3 uova + spinaci/pomodorini + 30g formaggio grattugiato + erbe aromatiche", prot: 33, kcal: 390 },
      { nome: "Uova alla coque con skyr", descr: "2 uova alla coque + 150g skyr o séré magro + frutto di stagione", prot: 34, kcal: 380 },
      { nome: "Omelette al salmone", descr: "2 uova + 60g salmone affumicato + erbe + 50g cottage cheese", prot: 36, kcal: 370 },
      { nome: "Toast proteico", descr: "2 fette pane integrale (80g) + 2 uova + 80g ricotta o cottage cheese + pomodoro", prot: 33, kcal: 420 },
      { nome: "Shakshuka leggera", descr: "2 uova in salsa pomodoro-peperone + 50g pane integrale + 50g cottage cheese", prot: 30, kcal: 400 },
    ],
    spesa: {
      "Uova grandi (L)": { q: 4, u: "pz", cat: "Uova" },
      "Cottage cheese": { q: 100, u: "g", cat: "Latticini" },
      "Avocado": { q: 75, u: "g", cat: "Frutta e verdura" },
    },
    macro: { prot: 35, kcal: 400 },
  },
  "MT": {
    nome: "Colazione rapida (shake proteico)",
    orario: "07:00",
    componenti: [
      "50g cereali integrali a scelta",
      "1 scoop whey protein (30g) + 200ml latte mandorla ss zucchero",
      "frutta a scelta",
      "1 manciata oleaginosi (15g)  OPPURE  2 CAS semi chia (20g)",
      "cannella in polvere",
    ],
    opzioni: [
      { nome: "Shake classico con cereali", descr: "50g cereali + 30g whey + 200ml latte mandorla + frutta + 15g oleaginosi", prot: 38, kcal: 380 },
      { nome: "Porridge proteico", descr: "50g fiocchi avena cotti + 30g whey mescolato + frutti di bosco + 15g noci", prot: 36, kcal: 390 },
      { nome: "Skyr bowl", descr: "200g skyr o yogurt greco + 50g muesli ss zucchero + banana + 15g mandorle", prot: 35, kcal: 400 },
      { nome: "Smoothie proteico", descr: "150g yogurt greco 0% + 1 frutto + 30g whey + 200ml latte mandorla + semi chia", prot: 40, kcal: 370 },
      { nome: "Overnight oats", descr: "40g avena + 200ml latte mandorla (riposo notte) + 100g cottage cheese + frutti rossi", prot: 34, kcal: 380 },
      { nome: "Pane di segale con ricotta", descr: "2 fette pane segale (80g) + 100g ricotta magra + frutti rossi + 1 cac miele", prot: 28, kcal: 360 },
    ],
    nota: "Alternativa: sostituire whey + latte con 200g yogurt proteico",
    spesa: {
      "Cereali integrali": { q: 50, u: "g", cat: "Cereali" },
      "Whey protein": { q: 30, u: "g", cat: "Integratori" },
      "Latte di mandorla ss zucchero": { q: 200, u: "ml", cat: "Latticini vegetali" },
      "Frutta fresca": { q: 150, u: "g", cat: "Frutta" },
      "Oleaginosi": { q: 15, u: "g", cat: "Semi e frutta secca" },
    },
    macro: { prot: 38, kcal: 380 },
  },
  "SAB": {
    nome: "Colazione pancakes proteici / avena",
    orario: "07:00",
    componenti: [
      "OPZIONE A: 1 porzione pancakes proteici alla banana (249g)",
      "OPZIONE B: 1 porzione fiocchi d'avena imbevuti grande (292g)",
    ],
    opzioni: [
      { nome: "Pancakes proteici alla banana", descr: "249g totali: banana + 2 uova + 30g whey + farina avena + lievito.", prot: 30, kcal: 420 },
      { nome: "Porridge di avena imbevuto", descr: "292g: 100g avena + 200ml latte mandorla + banana + frutti rossi. Riposo 10 min.", prot: 28, kcal: 410 },
      { nome: "French toast integrale", descr: "2 fette pane integrale bagnate in 2 uova + cannella + cotte in padella + 100g cottage cheese", prot: 32, kcal: 430 },
      { nome: "Crepes proteiche", descr: "2 crepes: 40g farina avena + 2 uova + 100ml latte mandorla + 50g ricotta + frutti rossi", prot: 31, kcal: 400 },
      { nome: "Smoothie bowl", descr: "Base: banana congelata + 30g whey + latte mandorla. Topping: 30g granola + semi + frutti", prot: 29, kcal: 420 },
      { nome: "Waffles proteici", descr: "Come pancakes ma in waflera: 40g farina avena + 2 uova + 30g whey + 100ml latte mandorla", prot: 33, kcal: 415 },
    ],
    nota: "Ricette del piano Serafino",
    spesa: {
      "Fiocchi d'avena": { q: 100, u: "g", cat: "Cereali" },
      "Banane": { q: 1, u: "pz", cat: "Frutta" },
      "Uova grandi (L)": { q: 2, u: "pz", cat: "Uova" },
      "Whey protein": { q: 30, u: "g", cat: "Integratori" },
    },
    macro: { prot: 30, kcal: 420 },
  },
  "DOM": {
    nome: "Colazione beans",
    orario: "07:00",
    componenti: [
      "150g fagioli rossi/bianchi/neri cotti",
      "150g cottage cheese  OPPURE  skyr / séré magro",
      "½ avocado",
      "+ verdure a scelta",
    ],
    opzioni: [
      { nome: "Beans classica", descr: "150g fagioli + 150g cottage cheese + ½ avocado + verdure a piacere", prot: 32, kcal: 400 },
      { nome: "Lenticchie e skyr", descr: "200g lenticchie rosse cotte + 150g skyr + ½ avocado + rucola + pomodorini", prot: 35, kcal: 420 },
      { nome: "Ceci con cottage cheese", descr: "150g ceci cotti + 100g cottage cheese + pomodorini + basilico + 1 filo olio EVO", prot: 30, kcal: 390 },
      { nome: "Shakshuka beans", descr: "2 uova in salsa pomodoro + 100g fagioli neri + 50g pane integrale + prezzemolo", prot: 31, kcal: 410 },
      { nome: "Tofu scramble", descr: "150g tofu sbriciolato + curcuma + 100g fagioli + peperone saltato + erbe aromatiche", prot: 28, kcal: 370 },
      { nome: "Bowl proteica domenicale", descr: "100g edamame + 100g ceci + 100g cottage cheese + ½ avocado + semi misti", prot: 34, kcal: 410 },
    ],
    spesa: {
      "Fagioli rossi/bianchi/neri cotti": { q: 150, u: "g", cat: "Legumi" },
      "Cottage cheese": { q: 150, u: "g", cat: "Latticini" },
      "Avocado": { q: 75, u: "g", cat: "Frutta e verdura" },
    },
    macro: { prot: 32, kcal: 400 },
  },
};

// ═══════════════════════════════════════════════════════
// CENE SPECIALI WEEKEND
// ═══════════════════════════════════════════════════════

export const CENA_SAB: CenaSpeciale = {
  nome: "Esempio cena pasta (sabato)",
  entrée: "Crudités + vinaigrette (facoltativo se no verdure con pasta)",
  componenti: [
    "Verdure crude/cotte (1/3 – ½ piatto)",
    "200g pasta di legumi cotta (= 100g cruda)",
    "25g formaggio  OPPURE  10g burro  OPPURE  25g pesto  OPPURE  25g crème entière",
    "1 CAS olio EVO (10g)",
  ],
  macro: { prot: 55, kcal: 620 },
};

export const CENA_DOM: CenaSpeciale = {
  nome: "Esempio cena beans based (domenica)",
  componenti: [
    "Verdure crude/cotte (1/3 – ½ piatto)",
    "190g fagioli rossi/bianchi/neri cotti",
    "150g cereali/pasta cotti  OPPURE  200g patata dolce  OPPURE  180g lenticchie",
    "Grasso: olio EVO / avocado / oleaginosi (stessa lista pranzo)",
  ],
  macro: { prot: 50, kcal: 600 },
};

// ═══════════════════════════════════════════════════════
// COSTANTI
// ═══════════════════════════════════════════════════════

export const SPUNTINO_MATTINA = "1 frutto a scelta (10:00)";
export const SHAKE = "1 scoop whey (30g) + 5g creatina  [16:00]";
export const GOUTER = "Olive / formaggio / hummus / oleaginosi (15g)  +  100g cottage cheese  +  crudités  [16:00]";

export const PAZIENTE = {
  nome: "Emanuele RIPICCINI",
  eta: 38,
  altezza_cm: 178,
  peso_kg: 87.38,
  target_prot_giorno: 178,
  target_kcal_pasto: 620,
  target_prot_pasto: 53,
};

export const TIPO_GIORNO_MAP: Record<number, 'LMV' | 'MT' | 'SAB' | 'DOM'> = {
  0: 'LMV',
  1: 'MT',
  2: 'LMV',
  3: 'MT',
  4: 'LMV',
  5: 'SAB',
  6: 'DOM',
};

export const GIORNI_BREVI = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
export const GIORNI_LUNGHI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
export const NOME_MESI_IT = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
export const MESI_BREVI = ['', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

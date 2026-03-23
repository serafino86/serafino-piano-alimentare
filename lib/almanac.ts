// ═══════════════════════════════════════════════════════
// ALMANACCO — Frasi motivazionali del coach
// Una frase per ogni giorno, ruotate per giorno dell'anno
// Stile: coach italiano, dieta mediterranea, disciplina gentile
// ═══════════════════════════════════════════════════════

export interface FraseAlmanacco {
  frase: string;
  autore?: string;   // opzionale, se citazione
  tema: string;      // tag interno per debug
}

const FRASI: FraseAlmanacco[] = [
  // ── Consistenza & abitudine ────────────────────────────
  {
    frase: "Non è la perfezione che costruisce il corpo — è la costanza silenziosa di ogni giorno.",
    tema: "consistenza",
  },
  {
    frase: "Il piatto di oggi non cambia tutto. Ma il piatto di oggi, e domani, e dopodomani — sì.",
    tema: "consistenza",
  },
  {
    frase: "Un'abitudine non si costruisce con la forza di volontà. Si costruisce rendendo la scelta giusta quella più semplice.",
    tema: "consistenza",
  },
  {
    frase: "Ogni pasto è un voto che dai a te stesso su chi vuoi diventare.",
    tema: "consistenza",
  },
  {
    frase: "La disciplina è libertà. Chi mangia bene ogni giorno non pensa a cosa mangiare — lo sa già.",
    tema: "consistenza",
  },
  {
    frase: "Il corpo tiene il conto anche quando tu non lo fai. Fidati del processo.",
    tema: "consistenza",
  },
  {
    frase: "Non cercare la motivazione ogni mattina. Costruisci il sistema che funziona anche quando non hai voglia.",
    tema: "consistenza",
  },
  {
    frase: "I risultati sono la somma di mille scelte ordinarie fatte bene.",
    tema: "consistenza",
  },

  // ── Proteine & muscolo ─────────────────────────────────
  {
    frase: "Le proteine non sono un optional. Sono i mattoni con cui il tuo corpo si rinnova ogni giorno.",
    tema: "proteine",
  },
  {
    frase: "178 grammi di proteine oggi. Non perché sei ossessionato — perché hai un obiettivo e lo rispetti.",
    tema: "proteine",
  },
  {
    frase: "Il muscolo si costruisce a tavola tanto quanto in palestra. Spesso di più.",
    tema: "proteine",
  },
  {
    frase: "Pesare il cibo non è una punizione. È il linguaggio preciso con cui parli al tuo corpo.",
    tema: "proteine",
  },
  {
    frase: "Ogni grammo di proteina che mangi è un investimento che il tuo corpo incassa nelle ore successive.",
    tema: "proteine",
  },

  // ── Cucina italiana & piacere ──────────────────────────
  {
    frase: "Mangiare bene non significa mangiare poco. Significa mangiare vero.",
    tema: "cucina",
  },
  {
    frase: "La cucina mediterranea non è una dieta — è una filosofia di vita che dura da tremila anni.",
    tema: "cucina",
  },
  {
    frase: "Un filo di olio EVO a crudo su un piatto semplice: questo è il lusso vero.",
    tema: "cucina",
  },
  {
    frase: "Le erbe aromatiche non profumano solo il cibo. Profumano il gesto di chi cucina con intenzione.",
    tema: "cucina",
  },
  {
    frase: "Il limone è il condimento dei forti. Alcalinizza, esalta, non appesantisce.",
    tema: "cucina",
  },
  {
    frase: "Cucinare al vapore non è rinunciare al gusto. È rispettare ciò che mangi.",
    tema: "cucina",
  },
  {
    frase: "I legumi sono la proteina più antica del Mediterraneo. Il tuo corpo li riconosce da generazioni.",
    tema: "cucina",
  },
  {
    frase: "Un piatto colorato è un piatto vivo. Mangia con gli occhi prima che con la bocca.",
    tema: "cucina",
  },
  {
    frase: "La pasta di legumi non è un compromesso — è un'evoluzione. Stessa tradizione, più intelligenza.",
    tema: "cucina",
  },

  // ── Corpo & benessere ──────────────────────────────────
  {
    frase: "Il tuo corpo non è un progetto da correggere. È uno strumento da accordare.",
    tema: "corpo",
  },
  {
    frase: "L'infiammazione si combatte a tavola, giorno dopo giorno, prima ancora che inizi.",
    tema: "corpo",
  },
  {
    frase: "Ogni cellula del tuo corpo si rinnova. Ciò che mangi oggi diventerà chi sei domani.",
    tema: "corpo",
  },
  {
    frase: "L'energia non si trova in una bibita. Si costruisce con un sonno buono, un pasto vero, un respiro profondo.",
    tema: "corpo",
  },
  {
    frase: "Il corpo sa come guarire. Il tuo compito è non ostacolarlo.",
    tema: "corpo",
  },
  {
    frase: "Idratazione, proteine, verdure, riposo. Non è una formula magica — è la base di tutto.",
    tema: "corpo",
  },
  {
    frase: "Ascolta il corpo dopo ogni pasto. Ti dice sempre la verità.",
    tema: "corpo",
  },

  // ── Mente & disciplina ─────────────────────────────────
  {
    frase: "La forza mentale si costruisce nelle piccole scelte. Non nella grande occasione — in questa, ora.",
    tema: "mente",
  },
  {
    frase: "Non hai bisogno di essere motivato ogni giorno. Hai bisogno di aver deciso una volta, bene.",
    tema: "mente",
  },
  {
    frase: "Il perfetto è nemico del fatto. Un pasto al 90% del piano vale infinitamente più di zero.",
    tema: "mente",
  },
  {
    frase: "Chi si prende cura di sé non è egoista. È una persona che avrà l'energia per prendersi cura degli altri.",
    tema: "mente",
  },
  {
    frase: "Il cervello si nutre di ciò che mangi. Un pasto equilibrato è anche un pensiero più chiaro.",
    tema: "mente",
  },
  {
    frase: "Non stai seguendo una dieta. Stai costruendo il modo in cui vivi.",
    tema: "mente",
  },
  {
    frase: "La coerenza batte la perfezione. Sempre.",
    tema: "mente",
  },

  // ── Lunedì & inizio settimana ──────────────────────────
  {
    frase: "Lunedì non è la seconda chance. È semplicemente il prossimo passo.",
    tema: "settimana",
  },
  {
    frase: "Una nuova settimana, lo stesso corpo che aspetta le tue scelte. Rendile buone.",
    tema: "settimana",
  },
  {
    frase: "Prepara il frigorifero domenica sera. È il gesto più potente che puoi fare per la settimana.",
    tema: "settimana",
  },

  // ── Weekend ────────────────────────────────────────────
  {
    frase: "Il weekend non è una pausa dal piano. È il momento in cui il piano diventa piacere.",
    tema: "weekend",
  },
  {
    frase: "La pasta di legumi del sabato sera non è uno sgarro — è parte del progetto.",
    tema: "weekend",
  },
  {
    frase: "Goditi il pasto del weekend senza sensi di colpa. Fa parte dell'equazione.",
    tema: "weekend",
  },

  // ── Stagionalità ───────────────────────────────────────
  {
    frase: "Mangia ciò che la stagione offre. La natura sa già di cosa hai bisogno.",
    tema: "stagionalità",
  },
  {
    frase: "Un frutto di stagione a colazione è un accordo silenzioso con il ritmo naturale del tuo corpo.",
    tema: "stagionalità",
  },
  {
    frase: "Le verdure di stagione costano meno, sanno di più e fanno meglio. Vinci su tutti i fronti.",
    tema: "stagionalità",
  },

  // ── Progressi & risultati ──────────────────────────────
  {
    frase: "Non misurare i progressi solo sulla bilancia. Misurali sull'energia, il sonno, la lucidità.",
    tema: "progressi",
  },
  {
    frase: "I cambiamenti veri sono lenti e profondi. Diffida di chi ti promette il contrario.",
    tema: "progressi",
  },
  {
    frase: "Ogni chilo perso in modo sostenibile è un chilo che non torna.",
    tema: "progressi",
  },
  {
    frase: "Il grafico dei progressi non è una linea retta. È una salita con plateau, scivoloni e riprese. Tutti ce li hanno.",
    tema: "progressi",
  },
  {
    frase: "Confrontati solo con chi eri ieri. Gli altri non hanno il tuo corpo, la tua storia, il tuo punto di partenza.",
    tema: "progressi",
  },

  // ── Shake & integrazione ───────────────────────────────
  {
    frase: "Lo shake delle 16:00 è il segnale che ti dai: stai costruendo qualcosa di solido.",
    tema: "integrazione",
  },
  {
    frase: "La creatina non è una scorciatoia. È un alleato che funziona solo se fai il resto.",
    tema: "integrazione",
  },
  {
    frase: "Il goûter non è uno spuntino — è una strategia. Tiene a bada la fame, stabilizza l'energia, protegge la cena.",
    tema: "integrazione",
  },

  // ── Filosofia & vita ───────────────────────────────────
  {
    frase: "Il cibo non è il nemico. Non è neanche il premio. È il carburante e il piacere insieme.",
    tema: "filosofia",
  },
  {
    frase: "Una vita sana non profuma di privazione. Profuma di basilico fresco e olio buono.",
    tema: "filosofia",
  },
  {
    frase: "Mangiare bene è un atto di rispetto verso te stesso che si ripete tre volte al giorno.",
    tema: "filosofia",
  },
  {
    frase: "Non esiste il cibo perfetto. Esiste il pasto giusto, nel momento giusto, nella quantità giusta.",
    tema: "filosofia",
  },
  {
    frase: "La semplicità è la raffinatezza più difficile da raggiungere — in cucina come in tutto.",
    tema: "filosofia",
  },
  {
    frase: "Ogni giorno è un nuovo laboratorio. Osserva come il tuo corpo risponde. Aggiusta. Continua.",
    tema: "filosofia",
  },
  {
    frase: "Il benessere non è una destinazione. È il modo in cui percorri la strada.",
    tema: "filosofia",
  },
  {
    frase: "Dai al tuo corpo quello di cui ha bisogno con costanza — e lascia che faccia il resto.",
    tema: "filosofia",
  },
];

// ─────────────────────────────────────────
// Funzione principale — una frase per ogni giorno
// Ruota in base al giorno dell'anno (0–365)
// ─────────────────────────────────────────

export function getFraseDelGiorno(dataISO: string): FraseAlmanacco {
  const d = new Date(dataISO);
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return FRASI[dayOfYear % FRASI.length];
}

// Versione client-safe (usa data corrente se non passata)
export function getFraseOggi(): FraseAlmanacco {
  const oggi = new Date().toISOString().slice(0, 10);
  return getFraseDelGiorno(oggi);
}

export const TOTALE_FRASI = FRASI.length;

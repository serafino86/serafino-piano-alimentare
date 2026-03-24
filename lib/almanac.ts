// ═══════════════════════════════════════════════════════
// ALMANACCO SERAFINO — Frasi coach, PNL, proverbi, saggezza
// 150 frasi per rotazione quotidiana (5 mesi senza ripetizioni)
// ═══════════════════════════════════════════════════════

export interface FraseAlmanacco {
  frase: string;
  autore?: string;
  tema: string;
}

const FRASI: FraseAlmanacco[] = [

  // ── PNL & Mindset ─────────────────────────────────────
  {
    frase: "La mappa non è il territorio. Cambia la mappa e cambi il mondo che vedi.",
    tema: "pnl",
  },
  {
    frase: "Non esiste fallimento, esiste solo feedback. Ogni risultato ti dice qualcosa.",
    tema: "pnl",
  },
  {
    frase: "Il tuo corpo ascolta ogni parola che dice la tua mente. Sceglile con cura.",
    tema: "pnl",
  },
  {
    frase: "Dietro ogni comportamento c'è un'intenzione positiva. Trovala e puoi cambiare il comportamento.",
    tema: "pnl",
  },
  {
    frase: "Le risorse di cui hai bisogno sono già dentro di te. Stai solo imparando ad accedervi.",
    tema: "pnl",
  },
  {
    frase: "Chi controlla la propria fisiologia controlla il proprio stato. Respira. Raddrizza la schiena. Ricomincia.",
    tema: "pnl",
  },
  {
    frase: "Ogni abitudine è un'ancora. Costruisci quelle giuste e ti porteranno dove vuoi senza sforzo.",
    tema: "pnl",
  },
  {
    frase: "Il cambiamento avviene al livello in cui credi di meritarlo. Alza quel livello.",
    tema: "pnl",
  },
  {
    frase: "Modella chi ammiri. Copia la struttura del successo, non il contenuto.",
    tema: "pnl",
  },
  {
    frase: "Il cervello non distingue tra un'esperienza vissuta e una immaginata con intensità. Visualizza già arrivato.",
    tema: "pnl",
  },

  // ── Proverbi del mondo ─────────────────────────────────
  {
    frase: "Il momento migliore per piantare un albero era vent'anni fa. Il secondo momento migliore è adesso.",
    autore: "Proverbio cinese",
    tema: "proverbio",
  },
  {
    frase: "Chi vuole fare trova un modo. Chi non vuole fare trova una scusa.",
    autore: "Proverbio arabo",
    tema: "proverbio",
  },
  {
    frase: "Cade sette volte, si rialza otto.",
    autore: "Proverbio giapponese",
    tema: "proverbio",
  },
  {
    frase: "Non rimandare a domani quello che il tuo corpo ti chiede oggi.",
    autore: "Adattamento da proverbio latino",
    tema: "proverbio",
  },
  {
    frase: "L'acqua scava la roccia non con la forza, ma con la costanza.",
    autore: "Ovidio",
    tema: "proverbio",
  },
  {
    frase: "Tratta il tuo corpo come il luogo dove vivi. Perché lo è.",
    autore: "Proverbio africano",
    tema: "proverbio",
  },
  {
    frase: "Anche un viaggio di mille miglia inizia con un singolo passo.",
    autore: "Laozi",
    tema: "proverbio",
  },
  {
    frase: "Non puoi controllare il vento, ma puoi orientare le vele.",
    autore: "Proverbio marinaro",
    tema: "proverbio",
  },
  {
    frase: "L'uomo è ciò che mangia.",
    autore: "Ludwig Feuerbach",
    tema: "proverbio",
  },
  {
    frase: "Che il cibo sia la tua medicina e la medicina sia il tuo cibo.",
    autore: "Ippocrate",
    tema: "proverbio",
  },
  {
    frase: "Non c'è vento favorevole per chi non sa dove andare.",
    autore: "Seneca",
    tema: "proverbio",
  },
  {
    frase: "Prima cura te stesso. Chi non lo fa, non può prendersi cura di nessuno.",
    autore: "Proverbio sufi",
    tema: "proverbio",
  },

  // ── Stoicismo & filosofia ──────────────────────────────
  {
    frase: "Distingui ciò che dipende da te da ciò che non dipende. Poi occupati solo del primo.",
    autore: "Epitteto",
    tema: "stoicismo",
  },
  {
    frase: "Oggi non è un giorno qualunque. È l'unico giorno che hai con certezza.",
    tema: "stoicismo",
  },
  {
    frase: "Opus est in rebus — bisogna agire. La ruminazione senza azione è solo rumore.",
    autore: "Marco Aurelio",
    tema: "stoicismo",
  },
  {
    frase: "Non lamentarti del freddo di gennaio. Gennaio è fatto di freddo, il corpo di resistenza.",
    tema: "stoicismo",
  },
  {
    frase: "Perdita di tempo è la peggiore delle perdite. Il pasto sano di oggi non torna.",
    autore: "Seneca — adattato",
    tema: "stoicismo",
  },
  {
    frase: "Amor fati — ama il tuo destino. Anche la fatica di oggi fa parte del progetto.",
    autore: "Nietzsche",
    tema: "stoicismo",
  },
  {
    frase: "Il lusso indebolisce l'animo e il corpo. La semplicità li fortifica entrambi.",
    autore: "Epitteto",
    tema: "stoicismo",
  },
  {
    frase: "Memento mori — ricordati che sei mortale. E scegli come vuoi vivere nel tempo che hai.",
    tema: "stoicismo",
  },

  // ── Neuroscienze & abitudini ───────────────────────────
  {
    frase: "Ogni volta che ripeti un'azione, lo strato di mielina attorno a quel circuito si ispessisce. Letteralmente diventi quello che fai.",
    tema: "neuroscienze",
  },
  {
    frase: "Il segnale della fame è spesso sete. Prima di mangiare fuori pasto, bevi un bicchiere d'acqua e aspetta tre minuti.",
    tema: "neuroscienze",
  },
  {
    frase: "La dopamina non premia il risultato — premia l'anticipazione. Inizia il pasto sano e il cervello si unirà a te.",
    tema: "neuroscienze",
  },
  {
    frase: "Il cortisolo alto sabota i muscoli. Dormi, respira, sorridi. È fisiologia, non poesia.",
    tema: "neuroscienze",
  },
  {
    frase: "66 giorni. Tanti ne servono in media per automatizzare un'abitudine. Sei già oltre il primo.",
    tema: "neuroscienze",
  },
  {
    frase: "Il cervello ama le abitudini perché consumano meno energia. Costruiscine di buone e risparmia forza di volontà per ciò che conta.",
    tema: "neuroscienze",
  },
  {
    frase: "Mangiare lentamente aumenta la sazietà del 30%. Il pasto non è un compito da sbrigare.",
    tema: "neuroscienze",
  },

  // ── Coach atletico ─────────────────────────────────────
  {
    frase: "I campioni si costruiscono quando nessuno guarda. Tu stai costruendo adesso.",
    tema: "atletico",
  },
  {
    frase: "La sfida non è fare la cosa giusta quando hai voglia. È farla quando non ce l'hai.",
    tema: "atletico",
  },
  {
    frase: "Non confrontare il tuo capitolo 1 con il capitolo 10 di qualcun altro.",
    tema: "atletico",
  },
  {
    frase: "Il tuo corpo sa fare cose straordinarie. Il limite è quasi sempre nella testa.",
    tema: "atletico",
  },
  {
    frase: "Un 1% di miglioramento al giorno. In un anno sei 37 volte meglio. È matematica.",
    autore: "James Clear",
    tema: "atletico",
  },
  {
    frase: "La forma fisica si costruisce in palestra. Si mantiene a tavola. Si perde nella mente.",
    tema: "atletico",
  },
  {
    frase: "Non aspettare di sentirti in forma per allenarti bene. Allenati bene per sentirti in forma.",
    tema: "atletico",
  },
  {
    frase: "Il dolore muscolare di ieri è la forza di oggi. Il pasto sano di oggi è l'energia di domani.",
    tema: "atletico",
  },
  {
    frase: "Fai la cosa difficile ora. Il futuro te ne sarà grato.",
    tema: "atletico",
  },
  {
    frase: "I tuoi concorrenti si stanno allenando in questo momento. E tu?",
    tema: "atletico",
  },

  // ── Saggezza orientale ─────────────────────────────────
  {
    frase: "Il corpo è il tempio. Non si tratta di estetica. Si tratta di rispetto.",
    autore: "Tradizione ayurvedica",
    tema: "oriente",
  },
  {
    frase: "Hara hachi bu — mangia fino all'80% della sazietà. I centenari di Okinawa lo fanno da sempre.",
    autore: "Saggezza giapponese",
    tema: "oriente",
  },
  {
    frase: "Il bambù piega nella tempesta ma non si spezza. Sii flessibile nel metodo, inflessibile nell'obiettivo.",
    autore: "Zen",
    tema: "oriente",
  },
  {
    frase: "Wu wei — l'azione senza sforzo. Un'abitudine radicata non costa fatica.",
    autore: "Taoismo",
    tema: "oriente",
  },
  {
    frase: "Kaizen: miglioramento continuo. Non si tratta di fare rivoluzioni. Si tratta di fare un po' meglio ogni giorno.",
    autore: "Filosofia giapponese",
    tema: "oriente",
  },
  {
    frase: "Ikigai — la ragione per alzarsi la mattina. Il tuo corpo sano è il fondamento di tutto il resto.",
    autore: "Tradizione giapponese",
    tema: "oriente",
  },
  {
    frase: "Nel mezzo del caos c'è anche opportunità. Il pasto sano in un giorno difficile è la vittoria più grande.",
    autore: "Sun Tzu — adattato",
    tema: "oriente",
  },

  // ── Identità & trasformazione ──────────────────────────
  {
    frase: "Ogni azione è un voto per il tipo di persona che vuoi diventare. Vota bene oggi.",
    autore: "James Clear",
    tema: "identità",
  },
  {
    frase: "Non stai cercando di perdere peso. Stai diventando la persona che non si preoccupa di perderlo.",
    tema: "identità",
  },
  {
    frase: "Smetti di chiederti se puoi. Chiedi chi sei quando ce la fai.",
    tema: "identità",
  },
  {
    frase: "L'identità è il livello più profondo del cambiamento. Quando credi di essere una persona sana, le scelte sane diventano ovvie.",
    tema: "identità",
  },
  {
    frase: "Non seguire una dieta. Diventa qualcuno che mangia bene. La differenza è enorme.",
    tema: "identità",
  },
  {
    frase: "Sii la persona che ammiresti. Oggi, a pranzo.",
    tema: "identità",
  },

  // ── Tempo & pazienza ───────────────────────────────────
  {
    frase: "La natura non si affretta, eppure tutto si compie.",
    autore: "Laozi",
    tema: "tempo",
  },
  {
    frase: "I risultati che vuoi hanno già una data di nascita. Si chiama oggi.",
    tema: "tempo",
  },
  {
    frase: "Non esiste scorciatoia verso un corpo forte. Esiste solo la strada.",
    tema: "tempo",
  },
  {
    frase: "Tra dieci anni guarderai indietro e dirai: sono contento di aver iniziato allora. Inizia adesso.",
    tema: "tempo",
  },
  {
    frase: "La pazienza non è aspettare passivamente. È continuare ad agire mentre aspetti i risultati.",
    tema: "tempo",
  },
  {
    frase: "Il tuo corpo di oggi è il risultato delle scelte di sei mesi fa. Le scelte di oggi costruiscono quello di sei mesi da ora.",
    tema: "tempo",
  },

  // ── Consistenza ────────────────────────────────────────
  {
    frase: "Non è la perfezione che costruisce il corpo — è la costanza silenziosa di ogni giorno.",
    tema: "consistenza",
  },
  {
    frase: "Il piatto di oggi non cambia tutto. Ma il piatto di oggi, e domani, e dopodomani — sì.",
    tema: "consistenza",
  },
  {
    frase: "La disciplina è libertà. Chi mangia bene ogni giorno non pensa a cosa mangiare — lo sa già.",
    tema: "consistenza",
  },
  {
    frase: "I risultati sono la somma di mille scelte ordinarie fatte bene.",
    tema: "consistenza",
  },
  {
    frase: "Non cercare la motivazione ogni mattina. Costruisci il sistema che funziona anche quando non hai voglia.",
    tema: "consistenza",
  },
  {
    frase: "Coerenza batte intensità. Sempre. In tutto.",
    tema: "consistenza",
  },
  {
    frase: "Il perfetto è nemico del fatto. Un pasto al 90% del piano vale infinitamente più di zero.",
    tema: "consistenza",
  },
  {
    frase: "Ogni giorno che rispetti il piano rafforza la prova che sei qualcuno che si rispetta.",
    tema: "consistenza",
  },

  // ── Grandi citazioni ───────────────────────────────────
  {
    frase: "Sii il cambiamento che vuoi vedere nel mondo — a partire dal tuo piatto.",
    autore: "Gandhi — adattato",
    tema: "citazioni",
  },
  {
    frase: "Prima di tutto, conosci te stesso. Il tuo corpo, le tue energie, i tuoi ritmi.",
    autore: "Socrate — adattato",
    tema: "citazioni",
  },
  {
    frase: "In un corpo sano vive una mente sana. Non è un'opzione, è una premessa.",
    autore: "Giovenale",
    tema: "citazioni",
  },
  {
    frase: "La forza non viene dalla capacità fisica. Viene da una volontà indomabile.",
    autore: "Gandhi",
    tema: "citazioni",
  },
  {
    frase: "Niente di grande è mai stato ottenuto senza entusiasmo.",
    autore: "Emerson",
    tema: "citazioni",
  },
  {
    frase: "Il talento vince le partite, ma il lavoro di squadra e l'intelligenza vincono i campionati.",
    autore: "Michael Jordan",
    tema: "citazioni",
  },
  {
    frase: "Se non trovi tempo per stare bene, presto dovrai trovare tempo per stare male.",
    autore: "Edward Stanley",
    tema: "citazioni",
  },
  {
    frase: "Chi non ha obiettivi non può segnare.",
    autore: "Casey Stengel",
    tema: "citazioni",
  },
  {
    frase: "Il dolore è temporaneo. Mollare è per sempre.",
    autore: "Lance Armstrong",
    tema: "citazioni",
  },
  {
    frase: "Quello che mangi in privato si vede in pubblico.",
    tema: "citazioni",
  },
  {
    frase: "La vera misura di un uomo non è come si comporta nei momenti di comodità, ma nelle sfide.",
    autore: "Martin Luther King",
    tema: "citazioni",
  },

  // ── Proteine & muscolo ─────────────────────────────────
  {
    frase: "Le proteine non sono un optional. Sono i mattoni con cui il tuo corpo si rinnova ogni giorno.",
    tema: "proteine",
  },
  {
    frase: "Il muscolo si costruisce a tavola tanto quanto in palestra. Spesso di più.",
    tema: "proteine",
  },
  {
    frase: "Pesare il cibo non è ossessione. È rispetto per il processo che hai scelto.",
    tema: "proteine",
  },
  {
    frase: "Ogni grammo di proteina che mangi è un investimento che il tuo corpo incassa nelle ore successive.",
    tema: "proteine",
  },
  {
    frase: "La sintesi proteica muscolare non aspetta. O la supporti con i pasti giusti, o smantelli quello che hai costruito.",
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
    frase: "Un filo di olio EVO a crudo su un piatto semplice. Questo è il lusso vero.",
    tema: "cucina",
  },
  {
    frase: "Le erbe aromatiche non profumano solo il cibo. Profumano il gesto di chi cucina con intenzione.",
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
    frase: "La semplicità è la raffinatezza più difficile da raggiungere — in cucina come in tutto.",
    tema: "cucina",
  },

  // ── Corpo & benessere ──────────────────────────────────
  {
    frase: "Il tuo corpo non è un progetto da correggere. È uno strumento da accordare.",
    tema: "corpo",
  },
  {
    frase: "Ogni cellula del tuo corpo si rinnova. Ciò che mangi oggi diventerà chi sei domani.",
    tema: "corpo",
  },
  {
    frase: "L'infiammazione si combatte a tavola, giorno dopo giorno, prima ancora che inizi.",
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
  {
    frase: "Il corpo tiene il conto anche quando tu non lo fai. Fidati del processo.",
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
    frase: "Il cervello si nutre di ciò che mangi. Un pasto equilibrato è anche un pensiero più chiaro.",
    tema: "mente",
  },
  {
    frase: "Chi si prende cura di sé non è egoista. È una persona che avrà l'energia per prendersi cura degli altri.",
    tema: "mente",
  },
  {
    frase: "Non stai seguendo una dieta. Stai costruendo il modo in cui vivi.",
    tema: "mente",
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
    frase: "Il grafico dei progressi non è una linea retta. È una salita con plateau, scivoloni e riprese. Tutti ce li hanno.",
    tema: "progressi",
  },
  {
    frase: "Confrontati solo con chi eri ieri. Gli altri non hanno il tuo corpo, la tua storia, il tuo punto di partenza.",
    tema: "progressi",
  },
  {
    frase: "Ogni chilo perso in modo sostenibile è un chilo che non torna.",
    tema: "progressi",
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
    frase: "Non esiste il cibo perfetto. Esiste il pasto giusto, nel momento giusto, nella quantità giusta.",
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

  // ── Weekend & stagionalità ─────────────────────────────
  {
    frase: "Il weekend non è una pausa dal piano. È il momento in cui il piano diventa piacere.",
    tema: "weekend",
  },
  {
    frase: "Goditi il pasto del weekend senza sensi di colpa. Fa parte dell'equazione.",
    tema: "weekend",
  },
  {
    frase: "Mangia ciò che la stagione offre. La natura sa già di cosa hai bisogno.",
    tema: "stagionalità",
  },
  {
    frase: "Le verdure di stagione costano meno, sanno di più e fanno meglio. Vinci su tutti i fronti.",
    tema: "stagionalità",
  },

  // ── Frasi potenti extra ────────────────────────────────
  {
    frase: "Se ti trattassi come tratti le cose che ami, come cambierebbe la tua giornata?",
    tema: "potente",
  },
  {
    frase: "Un anno da oggi vorrai aver iniziato oggi.",
    tema: "potente",
  },
  {
    frase: "Smetti di aspettare le condizioni perfette. Le condizioni perfette non arrivano. Agisci comunque.",
    tema: "potente",
  },
  {
    frase: "La motivazione ti fa partire. L'abitudine ti fa continuare. Costruisci l'abitudine.",
    tema: "potente",
  },
  {
    frase: "Le scuse e i risultati non possono coesistere. Scegli i risultati.",
    tema: "potente",
  },
  {
    frase: "Quello che fai oggi è l'unica cosa che conta. Non quello che pianifichi per lunedì.",
    tema: "potente",
  },
  {
    frase: "Il tuo futuro migliore inizia con una piccola scelta migliore. Adesso.",
    tema: "potente",
  },
  {
    frase: "Non c'è niente di più potente di qualcuno che ha deciso. Hai già deciso?",
    tema: "potente",
  },
  {
    frase: "Il sacrificio di oggi è il regalo che fai al te stesso di domani.",
    tema: "potente",
  },
  {
    frase: "Costruisci una vita che non ti fa venire voglia di scappare nel fine settimana. Inizia dal corpo.",
    tema: "potente",
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

export function getFraseOggi(): FraseAlmanacco {
  const oggi = new Date().toISOString().slice(0, 10);
  return getFraseDelGiorno(oggi);
}

export const TOTALE_FRASI = FRASI.length;

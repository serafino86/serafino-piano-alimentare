// ═══════════════════════════════════════════════
// DATABASE RICETTE ITALIANE — Piano Serafino
// Chiave: "PROTEINA__FECOLA__GRASSO"
// ═══════════════════════════════════════════════

export interface Ricetta {
  nome: string;
  sottotitolo: string;
  ingredienti: { nome: string; quantita: string; note?: string }[];
  preparazione: string[];
  tempo_prep: number;
  tempo_cottura: number;
  tecnica: 'vapore' | 'griglia' | 'forno' | 'crudo' | 'padella' | 'misto';
  consiglio_chef: string;
  variante_stagionale?: string;
  principio_nutrizionale: string;
}

export const RICETTE: Record<string, Ricetta> = {

  // ──────────────────────────────────────────
  // TONNO
  // ──────────────────────────────────────────

  "Tonno al naturale__Lenticchie cotte__Olio d'oliva EVO": {
    nome: "Insalata tiepida di lenticchie al tonno",
    sottotitolo: "Classico italiano proteico e alcalinizzante",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g", note: "Sgocciolato e asciugato bene" },
      { nome: "Lenticchie cotte", quantita: "180g", note: "Anche in scatola, sciacquate" },
      { nome: "Olio EVO", quantita: "10g (1 cucchiaio)" },
      { nome: "Verdure miste", quantita: "300g", note: "Cipolla rossa, pomodorini, sedano" },
      { nome: "Limone", quantita: "½", note: "Succo fresco" },
      { nome: "Prezzemolo fresco", quantita: "q.b." },
    ],
    preparazione: [
      "Scola e asciuga il tonno con carta da cucina.",
      "Scalda le lenticchie in padella con aglio in camicia 2 minuti.",
      "Affetta cipolla rossa sottile, aggiungi pomodorini e sedano a pezzetti.",
      "Componi il piatto: lenticchie tiepide, verdure crude, tonno spezzettato.",
      "Condisci con olio EVO a crudo, succo di limone e prezzemolo.",
    ],
    tempo_prep: 5,
    tempo_cottura: 5,
    tecnica: 'padella',
    consiglio_chef: "Asciuga sempre il tonno in scatola — rimuovi l'acqua in eccesso prima di condire per evitare che annacqui il piatto.",
    variante_stagionale: "In estate aggiungi cetriolo e basilico fresco. In inverno usa radicchio e noci.",
    principio_nutrizionale: "Tonno + lenticchie = doppia fonte proteica. Le lenticchie apportano anche ferro e fibre, il limone ne facilita l'assorbimento.",
  },

  "Tonno al naturale__Riso integrale cotto__Olio d'oliva EVO": {
    nome: "Riso integrale al tonno e pomodorini",
    sottotitolo: "Bowl mediterranea veloce e bilanciata",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g", note: "Sgocciolato" },
      { nome: "Riso integrale cotto", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Pomodorini ciliegino", quantita: "150g" },
      { nome: "Basilico fresco", quantita: "q.b." },
      { nome: "Capperi", quantita: "1 cucchiaino", note: "Dissalati" },
    ],
    preparazione: [
      "Scalda il riso integrale in padella con un filo d'acqua.",
      "Taglia i pomodorini a metà, dissala i capperi.",
      "Sgocciola e asciuga il tonno, spezzettalo grossolanamente.",
      "Unisci riso, pomodorini, capperi e tonno in una ciotola.",
      "Condisci con olio EVO a crudo e basilico fresco spezzettato.",
    ],
    tempo_prep: 5,
    tempo_cottura: 5,
    tecnica: 'crudo',
    consiglio_chef: "Il riso integrale cotto in anticipo e raffreddato ha un indice glicemico più basso — preparalo la sera prima.",
    principio_nutrizionale: "Carboidrati integrali a basso IG + proteine magre + grassi buoni = pasto equilibrato e saziante.",
  },

  "Tonno al naturale__Pasta integrale / di legumi cotta__Olio d'oliva EVO": {
    nome: "Pasta integrale al tonno mediterranea",
    sottotitolo: "Il classico rivisitato con pasta di legumi",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g" },
      { nome: "Pasta integrale o di legumi cotta", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Pomodori pelati", quantita: "150g" },
      { nome: "Aglio", quantita: "1 spicchio" },
      { nome: "Origano secco", quantita: "1 cucchiaino" },
    ],
    preparazione: [
      "Scalda aglio in padella antiaderente con pochissimo olio, togli prima che brucci.",
      "Aggiungi pomodori pelati schiacciati, cuoci 8 minuti a fuoco medio.",
      "Unisci il tonno sgocciolato, mescola delicatamente per 2 minuti.",
      "Condisci la pasta cotta con il sugo e l'olio EVO rimasto.",
      "Completa con origano e, se vuoi, peperoncino.",
    ],
    tempo_prep: 5,
    tempo_cottura: 12,
    tecnica: 'padella',
    consiglio_chef: "Aggiungi il tonno sempre a fine cottura e a fuoco spento — il calore eccessivo lo asciuga e lo indurisce.",
    principio_nutrizionale: "La pasta di legumi triplica le proteine rispetto alla pasta normale, rendendo questo piatto quasi completo senza altri ingredienti proteici.",
  },

  "Tonno al naturale__Fagioli rossi/bianchi/neri cotti__Olio d'oliva EVO": {
    nome: "Tonno e fagioli all'italiana",
    sottotitolo: "Il grande classico della tradizione contadina toscana",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g" },
      { nome: "Fagioli cannellini cotti", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Cipolla rossa", quantita: "½ media" },
      { nome: "Salvia fresca", quantita: "3-4 foglie" },
      { nome: "Limone", quantita: "½" },
    ],
    preparazione: [
      "Affetta la cipolla rossa sottilissima e lasciala in acqua fredda 10 minuti (perde l'asprezza).",
      "Sciacqua i fagioli, scalda brevemente con salvia.",
      "Sgocciola il tonno, asciuga e spezzetta.",
      "Unisci fagioli tiepidi, cipolla scolata e tonno.",
      "Condisci con olio EVO a crudo, succo di limone, sale e pepe.",
    ],
    tempo_prep: 10,
    tempo_cottura: 5,
    tecnica: 'crudo',
    consiglio_chef: "Questo piatto nasce povero e deve restare semplice. La cipolla in acqua è il trucco dei toscani per renderla dolce.",
    principio_nutrizionale: "Piatto della tradizione mediterranea: proteine animali + vegetali + legumi = profilo aminoacidico completo.",
  },

  "Tonno al naturale__Quinoa / farro / orzo cotti__Avocado": {
    nome: "Bowl di quinoa al tonno e avocado",
    sottotitolo: "Fusion mediterraneo-californiano ad alto profilo nutrizionale",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Avocado maturo", quantita: "75g (½ avocado)" },
      { nome: "Pomodorini", quantita: "100g" },
      { nome: "Limone", quantita: "½", note: "Succo" },
      { nome: "Coriandolo o prezzemolo", quantita: "q.b." },
    ],
    preparazione: [
      "Cuoci la quinoa in acqua salata (rapporto 1:2), lascia riposare coperta 5 minuti.",
      "Taglia l'avocado a cubetti, irrora subito con limone.",
      "Sgocciola e asciuga il tonno, spezzettalo.",
      "Componi la bowl: quinoa alla base, tonno, avocado e pomodorini.",
      "Condisci con limone, erbe fresche. L'avocado sostituisce l'olio come grasso.",
    ],
    tempo_prep: 8,
    tempo_cottura: 15,
    tecnica: 'misto',
    consiglio_chef: "Con l'avocado come grasso, il piatto è già ricco: non aggiungere olio EVO. Usa solo limone per condire.",
    principio_nutrizionale: "Quinoa = proteina completa (tutti gli aminoacidi essenziali). Avocado = grassi monoinsaturi. Tonno = proteine magre. Triplice eccellenza.",
  },

  "Tonno al naturale__Pane integrale__Avocado": {
    nome: "Tartine al tonno e avocado",
    sottotitolo: "Pranzo veloce nutriente, pronto in 5 minuti",
    ingredienti: [
      { nome: "Tonno al naturale", quantita: "160g" },
      { nome: "Pane integrale", quantita: "75g (2 fette)" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Limone", quantita: "½" },
      { nome: "Pepe nero", quantita: "q.b." },
      { nome: "Pomodoro", quantita: "1 medio" },
    ],
    preparazione: [
      "Tosta il pane integrale (facoltativo).",
      "Schiaccia l'avocado con una forchetta, aggiungi limone e pepe.",
      "Sgocciola e asciuga il tonno.",
      "Spalma l'avocado sul pane, adagia il tonno sopra.",
      "Completa con fettine di pomodoro e un filo di limone.",
    ],
    tempo_prep: 5,
    tempo_cottura: 0,
    tecnica: 'crudo',
    consiglio_chef: "Scegli pane integrale con almeno 4g di fibre per porzione. L'avocado sul pane sostituisce completamente il burro.",
    principio_nutrizionale: "Grasso = avocado (grassi buoni). Pane integrale mantiene stabile la glicemia. Tonno fornisce 46g di proteine magre.",
  },

  // ──────────────────────────────────────────
  // POLLO / TACCHINO
  // ──────────────────────────────────────────

  "Petto di pollo / tacchino__Riso integrale cotto__Olio d'oliva EVO": {
    nome: "Petto di pollo grigliato con riso integrale",
    sottotitolo: "Il classico del fitness, con tecnica italiana",
    ingredienti: [
      { nome: "Petto di pollo", quantita: "200g" },
      { nome: "Riso integrale cotto", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Rosmarino fresco", quantita: "2 rametti" },
      { nome: "Limone", quantita: "1", note: "Succo + scorza" },
      { nome: "Aglio", quantita: "1 spicchio" },
      { nome: "Verdure miste grigliate", quantita: "300g" },
    ],
    preparazione: [
      "Marina il pollo 30 min con succo di limone, rosmarino, aglio schiacciato e pepe.",
      "Scalda la griglia o padella antiaderente a fuoco alto.",
      "Cuoci il pollo 6-7 min per lato senza muoverlo — forma la crosticina.",
      "Lascia riposare 3 minuti prima di tagliare (i succhi si ridistribuiscono).",
      "Servi con riso integrale caldo e verdure grigliate. Olio EVO a crudo sul tutto.",
    ],
    tempo_prep: 35,
    tempo_cottura: 15,
    tecnica: 'griglia',
    consiglio_chef: "Il riposo dopo la cottura è fondamentale: 3 minuti coperto con alluminio mantengono il pollo succoso.",
    variante_stagionale: "Estate: aggiungi erbe fresche (basilico, menta). Inverno: usa rosmarino e salvia con scorza di limone.",
    principio_nutrizionale: "Proteina magra per eccellenza (44g per porzione). Riso integrale fornisce energia a rilascio lento.",
  },

  "Petto di pollo / tacchino__Quinoa / farro / orzo cotti__Avocado": {
    nome: "Pollo alla griglia con quinoa e avocado",
    sottotitolo: "Bowl proteica completa stile mediterraneo moderno",
    ingredienti: [
      { nome: "Petto di pollo", quantita: "200g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Pomodorini", quantita: "150g" },
      { nome: "Limone", quantita: "1" },
      { nome: "Erbe miste (basilico, prezzemolo)", quantita: "q.b." },
    ],
    preparazione: [
      "Cuoci il pollo sulla griglia con limone e erbe (vedi ricetta base sopra).",
      "Prepara la quinoa in acqua salata, sgrana con una forchetta.",
      "Taglia l'avocado a cubetti, irrora con limone.",
      "Taglia il pollo a strisce sottili dopo il riposo.",
      "Componi la bowl e condisci con limone. Non aggiungere olio: l'avocado è il grasso.",
    ],
    tempo_prep: 35,
    tempo_cottura: 15,
    tecnica: 'griglia',
    consiglio_chef: "Taglia il pollo sempre contro le fibre muscolari — il risultato è più tenero in bocca.",
    principio_nutrizionale: "Quinoa + pollo = profilo aminoacidico completo. Avocado fornisce grassi monoinsaturi che facilitano l'assorbimento dei nutrienti liposolubili.",
  },

  "Petto di pollo / tacchino__Patate / patata dolce cotte__Olio d'oliva EVO": {
    nome: "Pollo al forno con patate aromatiche",
    sottotitolo: "Piatto della domenica, versione light e proteica",
    ingredienti: [
      { nome: "Petto di pollo", quantita: "200g" },
      { nome: "Patate o patata dolce", quantita: "200g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Rosmarino", quantita: "2 rametti" },
      { nome: "Aglio", quantita: "2 spicchi in camicia" },
      { nome: "Paprika dolce", quantita: "1 cucchiaino" },
    ],
    preparazione: [
      "Preriscalda il forno a 200°C. Taglia le patate a spicchi, asciugale bene.",
      "Disponi patate in teglia con aglio e rosmarino, inforna 20 minuti.",
      "Marina il pollo con paprika, sale e pepe.",
      "Aggiungi il pollo in teglia, cuoci altri 20-25 minuti.",
      "Sforna, lascia riposare 5 minuti. Aggiungi olio EVO a crudo prima di servire.",
    ],
    tempo_prep: 10,
    tempo_cottura: 45,
    tecnica: 'forno',
    consiglio_chef: "Asciuga le patate con carta da cucina prima di infornare: eliminate l'umidità, diventano croccanti senza friggere.",
    principio_nutrizionale: "Patata dolce = carboidrati complessi ad alto contenuto di beta-carotene. Pollo al forno = cottura magra senza grassi aggiunti.",
  },

  "Petto di pollo / tacchino__Pasta integrale / di legumi cotta__Pesto": {
    nome: "Pasta integrale al pesto con straccetti di pollo",
    sottotitolo: "Liguria incontra il piano alimentare proteico",
    ingredienti: [
      { nome: "Petto di pollo", quantita: "200g", note: "A straccetti" },
      { nome: "Pasta integrale o di legumi cotta", quantita: "150g" },
      { nome: "Pesto genovese", quantita: "25g" },
      { nome: "Pomodorini", quantita: "100g" },
      { nome: "Basilico fresco", quantita: "q.b." },
    ],
    preparazione: [
      "Cuoci la pasta al dente, conserva 2 cucchiai di acqua di cottura.",
      "Cuoci gli straccetti di pollo in padella antiaderente senza condimento, 4 min per lato.",
      "Unisci la pasta, il pesto e l'acqua di cottura — manteca a fuoco spento.",
      "Aggiungi gli straccetti di pollo e i pomodorini tagliati.",
      "Servi con basilico fresco. Il pesto è già il grasso del piatto.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'padella',
    consiglio_chef: "Il pesto non va mai cotto — aggiungilo sempre a fuoco spento o tiepido, altrimenti perde il colore verde vivo e il sapore fresco.",
    principio_nutrizionale: "Pesto = grassi buoni (olio EVO + pinoli). Con pasta di legumi si raggiungono quasi 60g di proteine totali in questo piatto.",
  },

  "Petto di pollo / tacchino__Lenticchie cotte__Olio d'oliva EVO": {
    nome: "Pollo con lenticchie alle erbe",
    sottotitolo: "Proteine doppie, gusto pieno, un solo piatto",
    ingredienti: [
      { nome: "Petto di pollo", quantita: "200g" },
      { nome: "Lenticchie cotte", quantita: "180g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Timo fresco", quantita: "3-4 rametti" },
      { nome: "Carota e sedano", quantita: "100g" },
      { nome: "Brodo vegetale", quantita: "100ml" },
    ],
    preparazione: [
      "Cuoci il pollo in padella con timo fino a doratura (6 min per lato).",
      "Togli il pollo e nella stessa padella aggiungi carota e sedano tritati.",
      "Aggiungi le lenticchie e il brodo, cuoci 5 minuti a fuoco medio.",
      "Rimetti il pollo a pezzetti nelle lenticchie, scalda insieme 2 minuti.",
      "Aggiungi olio EVO a crudo e timo fresco per finire.",
    ],
    tempo_prep: 10,
    tempo_cottura: 20,
    tecnica: 'padella',
    consiglio_chef: "Cuoci prima il pollo, poi usa il fondo di cottura per insaporire le lenticchie — recuperi tutti i succhi proteici.",
    principio_nutrizionale: "Pollo + lenticchie = oltre 60g di proteine totali. Le lenticchie forniscono anche ferro non-eme, meglio assorbito in presenza di proteine animali.",
  },

  // ──────────────────────────────────────────
  // SALMONE AFFUMICATO
  // ──────────────────────────────────────────

  "Salmone affumicato sockeye__Pane integrale__Avocado": {
    nome: "Toast al salmone e avocado",
    sottotitolo: "Colazione o pranzo nordico-mediterraneo",
    ingredienti: [
      { nome: "Salmone affumicato sockeye", quantita: "200g" },
      { nome: "Pane integrale", quantita: "75g (2 fette)" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Limone", quantita: "½" },
      { nome: "Aneto o erba cipollina", quantita: "q.b." },
      { nome: "Pepe nero", quantita: "q.b." },
    ],
    preparazione: [
      "Tosta il pane integrale.",
      "Schiaccia l'avocado con limone e pepe — non aggiungere olio (salmone già grasso).",
      "Spalma l'avocado sulle fette tostate.",
      "Adagia le fette di salmone affumicato sopra.",
      "Completa con aneto o erba cipollina e pepe. Niente sale: salmone già saporito.",
    ],
    tempo_prep: 5,
    tempo_cottura: 0,
    tecnica: 'crudo',
    consiglio_chef: "Il salmone affumicato è già una proteina grassa — l'avocado come grasso è sufficiente. Evita di aggiungere olio EVO o altri grassi.",
    principio_nutrizionale: "Omega-3 del salmone + grassi monoinsaturi dell'avocado = combinazione antiinfiammatoria potente. Salmone = proteina grassa, quindi niente grasso aggiuntivo.",
  },

  "Salmone affumicato sockeye__Quinoa / farro / orzo cotti__Olive (18 unità)": {
    nome: "Insalata di quinoa con salmone affumicato e olive",
    sottotitolo: "Bowl fredda completa, perfetta da portare",
    ingredienti: [
      { nome: "Salmone affumicato sockeye", quantita: "200g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Olive denocciolate", quantita: "54g (circa 18)" },
      { nome: "Cetriolo", quantita: "100g" },
      { nome: "Limone", quantita: "1" },
      { nome: "Aneto o prezzemolo", quantita: "q.b." },
    ],
    preparazione: [
      "Cuoci e raffredda la quinoa (o usa avanzata).",
      "Taglia il cetriolo a mezze lune, olive a metà.",
      "Spezza il salmone in pezzi irregolari.",
      "Unisci tutto in una ciotola, condisci con limone e erbe fresche.",
      "Niente olio: salmone e olive forniscono già i grassi necessari.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'crudo',
    consiglio_chef: "Le olive e il salmone contengono già abbastanza grassi. Il limone è il tuo unico condimento: abbondante e senza paura.",
    principio_nutrizionale: "Due fonti di grassi buoni (omega-3 del salmone + monoinsaturi delle olive) che insieme superano il fabbisogno di grassi del pasto.",
  },

  // ──────────────────────────────────────────
  // UOVA
  // ──────────────────────────────────────────

  "Uova grandi (L)__Patate / patata dolce cotte__Olio d'oliva EVO": {
    nome: "Frittata di patate al forno",
    sottotitolo: "La tortilla italiana, senza friggere",
    ingredienti: [
      { nome: "Uova grandi (L)", quantita: "4 uova + 2 albumi" },
      { nome: "Patate cotte", quantita: "200g", note: "A fette sottili" },
      { nome: "Olio EVO", quantita: "10g", note: "Solo per la teglia" },
      { nome: "Cipolla", quantita: "½ media" },
      { nome: "Rosmarino", quantita: "1 rametto" },
      { nome: "Verdure miste (spinaci, peperoni)", quantita: "200g" },
    ],
    preparazione: [
      "Preriscalda il forno a 180°C. Ungi una teglia con l'olio EVO.",
      "Sbatti le uova e gli albumi con sale, pepe e rosmarino.",
      "Disponi le fette di patata, cipolla e verdure nella teglia.",
      "Versa il composto di uova sopra le verdure.",
      "Inforna 20-25 minuti finché la frittata è dorata e soda al centro.",
    ],
    tempo_prep: 10,
    tempo_cottura: 25,
    tecnica: 'forno',
    consiglio_chef: "Fatta al forno è più digeribile della versione fritta. Puoi prepararla la sera e mangiarla fredda il giorno dopo.",
    principio_nutrizionale: "Uova = proteina grassa (i tuorli). Con l'olio EVO ridotto al minimo (solo per la teglia) il bilancio dei grassi resta corretto.",
  },

  "Uova grandi (L)__Lenticchie cotte__Olio d'oliva EVO": {
    nome: "Uova in camicia su letto di lenticchie",
    sottotitolo: "Elegante, nutriente, pronto in 15 minuti",
    ingredienti: [
      { nome: "Uova grandi (L)", quantita: "4 uova + 2 albumi" },
      { nome: "Lenticchie cotte", quantita: "180g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Aceto di vino bianco", quantita: "1 cucchiaio", note: "Per le uova in camicia" },
      { nome: "Spinaci freschi", quantita: "150g" },
      { nome: "Curcuma", quantita: "1 pizzico" },
    ],
    preparazione: [
      "Scalda le lenticchie con curcuma e spinaci freschi, 3 minuti a fuoco medio.",
      "Porta a ebollizione acqua con aceto, abbassa a fiamma bassa.",
      "Rompi un uovo alla volta in una tazzina, fai scivolare nell'acqua fremente.",
      "Cuoci 3-4 minuti per uova con tuorlo morbido.",
      "Disponi lenticchie e spinaci nel piatto, adagia le uova sopra. Olio EVO a crudo.",
    ],
    tempo_prep: 5,
    tempo_cottura: 10,
    tecnica: 'misto',
    consiglio_chef: "L'aceto nell'acqua aiuta l'albume a compattarsi attorno al tuorlo — non si sente nel sapore finale.",
    principio_nutrizionale: "Con le uova come proteina grassa, le lenticchie sono il feculento perfetto: apportano ferro e proteine vegetali senza aggiungere grassi.",
  },

  "Uova grandi (L)__Quinoa / farro / orzo cotti__Semi misti": {
    nome: "Shakshuka con quinoa e semi",
    sottotitolo: "Dal Medio Oriente alla cucina italiana, versione proteica",
    ingredienti: [
      { nome: "Uova grandi (L)", quantita: "4 uova + 2 albumi" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Semi misti (chia, zucca, girasole)", quantita: "15g" },
      { nome: "Passata di pomodoro", quantita: "200ml" },
      { nome: "Peperone rosso", quantita: "1 medio" },
      { nome: "Cumino, paprika", quantita: "1 cucchiaino ciascuno" },
    ],
    preparazione: [
      "Cuoci il peperone a dadini in padella con cumino e paprika, 5 minuti.",
      "Aggiungi la passata, porta a leggero bollore.",
      "Crea dei nidi nel sugo con un cucchiaio, rompi le uova dentro.",
      "Copri e cuoci 5-7 minuti per tuorli morbidi.",
      "Servi sulla quinoa, completa con semi misti a crudo.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'padella',
    consiglio_chef: "Semi misti sostituiscono l'olio EVO come fonte di grassi — perfetti con le uova che sono già proteina grassa.",
    principio_nutrizionale: "Semi misti = acidi grassi polinsaturi omega-3/6. Con uova e quinoa copri tutti gli aminoacidi essenziali.",
  },

  // ──────────────────────────────────────────
  // COTTAGE CHEESE
  // ──────────────────────────────────────────

  "Cottage cheese__Quinoa / farro / orzo cotti__Avocado": {
    nome: "Bowl proteica con quinoa, cottage e avocado",
    sottotitolo: "Fresco, veloce, completo senza cotture",
    ingredienti: [
      { nome: "Cottage cheese", quantita: "400g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Pomodorini", quantita: "150g" },
      { nome: "Limone", quantita: "1" },
      { nome: "Erba cipollina o basilico", quantita: "q.b." },
    ],
    preparazione: [
      "Prepara la quinoa in anticipo e lascia raffreddare.",
      "Taglia l'avocado a cubetti, irrora subito con limone.",
      "Componi la bowl: quinoa, cottage cheese, avocado e pomodorini.",
      "Condisci con limone, erbe fresche e pepe nero.",
      "Non aggiungere olio: avocado e cottage forniscono i grassi.",
    ],
    tempo_prep: 5,
    tempo_cottura: 15,
    tecnica: 'crudo',
    consiglio_chef: "Il cottage cheese deve essere a temperatura ambiente — freddo di frigo perde sapore e modifica la consistenza della bowl.",
    principio_nutrizionale: "Cottage = 48g proteine per porzione. Con quinoa superi ampiamente i 53g target del pasto.",
  },

  "Cottage cheese__Lenticchie cotte__Olio d'oliva EVO": {
    nome: "Bowl di lenticchie tiepide con cottage cheese",
    sottotitolo: "Contrasto caldo-freddo, proteine da record",
    ingredienti: [
      { nome: "Cottage cheese", quantita: "400g" },
      { nome: "Lenticchie cotte", quantita: "180g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Curcuma e cumino", quantita: "½ cucchiaino ciascuno" },
      { nome: "Pomodori freschi", quantita: "150g" },
      { nome: "Prezzemolo", quantita: "q.b." },
    ],
    preparazione: [
      "Scalda le lenticchie con curcuma e cumino, 3 minuti.",
      "Versa le lenticchie tiepide in una ciotola.",
      "Aggiungi il cottage cheese freddo a cucchiaiate sopra.",
      "Taglia i pomodori freschi a dadini, aggiungi alla bowl.",
      "Condisci con olio EVO a crudo e prezzemolo fresco.",
    ],
    tempo_prep: 5,
    tempo_cottura: 5,
    tecnica: 'padella',
    consiglio_chef: "Il contrasto tiepido-freddo rende questo piatto interessante. La curcuma sulle lenticchie è antinfiammatoria e colorata.",
    principio_nutrizionale: "Cottage + lenticchie = oltre 65g di proteine. Uno dei pasti più proteici del piano senza necessità di carne.",
  },

  // ──────────────────────────────────────────
  // TOFU
  // ──────────────────────────────────────────

  "Tofu__Riso integrale cotto__Olio d'oliva EVO": {
    nome: "Tofu dorato marinato con riso integrale",
    sottotitolo: "Proteine vegetali con tecnica asiatico-italiana",
    ingredienti: [
      { nome: "Tofu", quantita: "200g", note: "Tofu compatto, non silken" },
      { nome: "Riso integrale cotto", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Salsa di soia (tamari)", quantita: "2 cucchiai" },
      { nome: "Aglio e zenzero", quantita: "1 spicchio + 1cm" },
      { nome: "Verdure saltate (broccoli, carote)", quantita: "300g" },
    ],
    preparazione: [
      "Pressa il tofu tra due piatti con un peso sopra per 15 minuti — elimina l'acqua.",
      "Taglia a cubetti, marina in salsa di soia + aglio + zenzero 20 minuti.",
      "Scalda padella antiaderente a fuoco alto senza olio, cuoci il tofu marinato 4 min per lato.",
      "Salta le verdure nella stessa padella con l'olio EVO, 3 minuti.",
      "Servi su riso integrale, aggiungi il tofu dorato sopra.",
    ],
    tempo_prep: 35,
    tempo_cottura: 10,
    tecnica: 'padella',
    consiglio_chef: "Pressare il tofu è il passo più importante: senza pressione, il tofu rilascia vapore in padella e non fa la crosticina.",
    principio_nutrizionale: "Tofu = proteina vegetale completa. La marinatura con salsa di soia aggiunge sapore senza calorie significative.",
  },

  "Tofu__Mais in chicchi cotto__Latte di cocco allégé": {
    nome: "Curry di tofu e mais al latte di cocco",
    sottotitolo: "Speziato, cremoso, senza lattosio",
    ingredienti: [
      { nome: "Tofu", quantita: "200g" },
      { nome: "Mais in chicchi cotto", quantita: "165g" },
      { nome: "Latte di cocco allégé", quantita: "95ml" },
      { nome: "Curry in polvere", quantita: "1 cucchiaino" },
      { nome: "Cipolla e aglio", quantita: "½ cipolla + 2 spicchi" },
      { nome: "Pomodori pelati", quantita: "150g" },
    ],
    preparazione: [
      "Pressa e taglia il tofu a cubetti, rosolalo in padella senza olio 4 min.",
      "Nella stessa padella, soffriggi cipolla e aglio con curry 2 minuti.",
      "Aggiungi pomodori, mais e latte di cocco. Porta a bollore.",
      "Unisci il tofu rosolato, cuoci 10 minuti a fuoco medio.",
      "Il latte di cocco è il grasso del piatto — non aggiungere olio.",
    ],
    tempo_prep: 15,
    tempo_cottura: 20,
    tecnica: 'padella',
    consiglio_chef: "Usa latte di cocco allégé (non intero): stessa cremosità con il 60% di grassi in meno.",
    principio_nutrizionale: "Latte di cocco = grassi saturi MCT a catena media, metabolizzati diversamente dai grassi normali. Tofu + mais = profilo aminoacidico complementare.",
  },

  // ──────────────────────────────────────────
  // BRESAOLA (Viande des Grisons)
  // ──────────────────────────────────────────

  "Viande des Grisons (bresaola)__Pane integrale__Avocado": {
    nome: "Tartine di bresaola e avocado",
    sottotitolo: "Pranzo norditaliano in 5 minuti",
    ingredienti: [
      { nome: "Bresaola (Viande des Grisons)", quantita: "100g" },
      { nome: "Pane integrale", quantita: "75g (2-3 fette)" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Rucola", quantita: "50g" },
      { nome: "Limone", quantita: "½" },
      { nome: "Parmigiano a scaglie", quantita: "facoltativo" },
    ],
    preparazione: [
      "Schiaccia l'avocado con limone e pepe — non aggiungere olio.",
      "Spalma l'avocado sulle fette di pane integrale (tostate o no).",
      "Disponi le fette di bresaola.",
      "Completa con rucola fresca e un filo di limone.",
      "Opzionale: scaglie di parmigiano per sapore umami.",
    ],
    tempo_prep: 5,
    tempo_cottura: 0,
    tecnica: 'crudo',
    consiglio_chef: "La Viande des Grisons è già salata e stagionata — non aggiungere mai sale. Il limone esalta il suo sapore deciso.",
    principio_nutrizionale: "Bresaola = proteina magra per eccellenza (32g per 100g con soli 2g di grassi). Avocado come unica fonte di grasso mantiene il piatto in equilibrio.",
  },

  "Viande des Grisons (bresaola)__Quinoa / farro / orzo cotti__Olio d'oliva EVO": {
    nome: "Insalata di quinoa con bresaola e rucola",
    sottotitolo: "Fresca, proteica, da portare in ufficio",
    ingredienti: [
      { nome: "Bresaola (Viande des Grisons)", quantita: "100g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Rucola", quantita: "80g" },
      { nome: "Pomodorini", quantita: "100g" },
      { nome: "Limone", quantita: "1" },
    ],
    preparazione: [
      "Prepara la quinoa e lascia raffreddare completamente.",
      "Taglia la bresaola a listarelle.",
      "Unisci quinoa, rucola, pomodorini e bresaola.",
      "Condisci con olio EVO e succo di limone abbondante.",
      "Perfetta conservata in frigo fino al giorno dopo.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'crudo',
    consiglio_chef: "Prepara questa insalata la sera prima senza condimento — condisci solo al momento di mangiare per evitare che la rucola si afflosci.",
    principio_nutrizionale: "Quinoa proteina completa + bresaola magra = 40g proteine senza alcun grasso saturo rilevante.",
  },

  // ──────────────────────────────────────────
  // GAMBERI / SCAMPI
  // ──────────────────────────────────────────

  "Gamberi / scampi__Riso integrale cotto__Olio d'oliva EVO": {
    nome: "Gamberi saltati con riso integrale alle erbe",
    sottotitolo: "Veloce come un risotto, più leggero",
    ingredienti: [
      { nome: "Gamberi o scampi", quantita: "200g", note: "Già puliti" },
      { nome: "Riso integrale cotto", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Aglio", quantita: "2 spicchi" },
      { nome: "Prezzemolo fresco", quantita: "abbondante" },
      { nome: "Limone", quantita: "1" },
    ],
    preparazione: [
      "Scalda una padella a fuoco alto, aggiungi metà dell'olio EVO.",
      "Cuoci i gamberi 2 minuti per lato — non di più, diventano gommosi.",
      "Togli i gamberi, nella stessa padella aggiungi aglio e riso.",
      "Salta il riso 2 minuti, aggiungi succo di limone.",
      "Rimetti i gamberi, aggiungi l'olio restante a crudo e prezzemolo abbondante.",
    ],
    tempo_prep: 5,
    tempo_cottura: 8,
    tecnica: 'padella',
    consiglio_chef: "I gamberi cuociono in 2 minuti per lato a fuoco alto. Cuocerli troppo è l'errore più comune — diventano gommosi e insapori.",
    principio_nutrizionale: "Gamberi = proteina magra con soli 1.7g di grassi per 100g. Tra le proteine più magre disponibili.",
  },

  "Gamberi / scampi__Pasta integrale / di legumi cotta__Olio d'oliva EVO": {
    nome: "Pasta integrale ai gamberi e pomodorini",
    sottotitolo: "Il piatto dell'estate italiana, versione proteica",
    ingredienti: [
      { nome: "Gamberi o scampi", quantita: "200g" },
      { nome: "Pasta integrale o di legumi cotta", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Pomodorini ciliegino", quantita: "200g" },
      { nome: "Aglio", quantita: "2 spicchi" },
      { nome: "Basilico fresco", quantita: "abbondante" },
    ],
    preparazione: [
      "Cuoci i pomodorini in padella con aglio finché appassiscono, 5 minuti.",
      "Aggiungi i gamberi, cuoci 2-3 minuti totali, non di più.",
      "Unisci la pasta cotta al dente con poca acqua di cottura.",
      "Manteca velocemente a fuoco spento.",
      "Aggiungi olio EVO a crudo e basilico fresco prima di servire.",
    ],
    tempo_prep: 5,
    tempo_cottura: 10,
    tecnica: 'padella',
    consiglio_chef: "Tieni sempre un bicchiere di acqua di cottura — è amidacea e lega il sugo alla pasta senza aggiungere grassi.",
    principio_nutrizionale: "Con pasta di legumi: 50g+ proteine totali. Un piatto completo per i target del piano.",
  },

  "Gamberi / scampi__Polenta cotta__Olio d'oliva EVO": {
    nome: "Gamberi su letto di polenta morbida",
    sottotitolo: "Tradizione veneta in chiave proteica",
    ingredienti: [
      { nome: "Gamberi o scampi", quantita: "200g" },
      { nome: "Polenta cotta", quantita: "240g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Salvia fresca", quantita: "4-5 foglie" },
      { nome: "Aglio", quantita: "1 spicchio" },
      { nome: "Vino bianco secco", quantita: "30ml", note: "Per sfumare" },
    ],
    preparazione: [
      "Scalda la polenta con poca acqua finché torna cremosa.",
      "Soffriggi aglio e salvia in padella con metà dell'olio, 1 minuto.",
      "Aggiungi gamberi, cuoci 1 minuto, sfuma con vino bianco.",
      "Cuoci altri 2 minuti finché i gamberi sono rosa.",
      "Versa la polenta in un piatto fondo, adagia i gamberi. Olio EVO a crudo per finire.",
    ],
    tempo_prep: 5,
    tempo_cottura: 10,
    tecnica: 'padella',
    consiglio_chef: "La polenta deve restare morbida e cremosa — se è troppo soda aggiungi acqua calda poco alla volta.",
    principio_nutrizionale: "Polenta = indice glicemico moderato se cotta morbida. Gamberi = proteine con quasi zero grassi.",
  },

  // ──────────────────────────────────────────
  // SGOMBRO
  // ──────────────────────────────────────────

  "Sgombro al naturale__Patate / patata dolce cotte__Olio d'oliva EVO": {
    nome: "Sgombro e patate dolci al vapore",
    sottotitolo: "Omega-3 e beta-carotene in un piatto solo",
    ingredienti: [
      { nome: "Sgombro al naturale", quantita: "200g" },
      { nome: "Patata dolce cotta al vapore", quantita: "200g" },
      { nome: "Olio EVO", quantita: "10g", note: "Ridotto (sgombro già grasso)" },
      { nome: "Limone", quantita: "1" },
      { nome: "Prezzemolo", quantita: "q.b." },
      { nome: "Capperi dissalati", quantita: "1 cucchiaino" },
    ],
    preparazione: [
      "Cuoci la patata dolce a vapore finché è tenera (15-20 minuti).",
      "Sgocciola lo sgombro e asciuga bene.",
      "Taglia la patata a fette, disponi nel piatto.",
      "Adagia lo sgombro spezzettato sopra.",
      "Condisci con olio EVO (minimo — sgombro è grasso), limone abbondante e capperi.",
    ],
    tempo_prep: 5,
    tempo_cottura: 20,
    tecnica: 'vapore',
    consiglio_chef: "Lo sgombro è già ricco di grassi omega-3. Usa solo 5-7g di olio EVO invece di 10g per mantenere il bilanciamento del pasto.",
    principio_nutrizionale: "Sgombro = omega-3 EPA/DHA antiinfiammatori. Patata dolce = antiossidanti (beta-carotene). Combinazione top per il benessere cardiovascolare.",
  },

  // ──────────────────────────────────────────
  // MANZO MAGRO
  // ──────────────────────────────────────────

  "Carne manzo magra__Patate / patata dolce cotte__Olio d'oliva EVO": {
    nome: "Tagliata di manzo con patate al rosmarino",
    sottotitolo: "Il piatto della griglia toscana, versione bilanciata",
    ingredienti: [
      { nome: "Manzo magro (filetto o fesa)", quantita: "200g" },
      { nome: "Patate cotte al forno", quantita: "200g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Rosmarino fresco", quantita: "2 rametti" },
      { nome: "Rucola", quantita: "80g" },
      { nome: "Limone", quantita: "½" },
    ],
    preparazione: [
      "Porta la carne a temperatura ambiente 20 min prima della cottura.",
      "Scalda la griglia a fuoco alto. Cuoci il filetto 3-4 min per lato (cottura media-al sangue).",
      "Lascia riposare 5 minuti su tagliere, coperto.",
      "Taglia contro le fibre a fette di 1cm.",
      "Servi su rucola con patate al rosmarino. Olio EVO a crudo, limone.",
    ],
    tempo_prep: 25,
    tempo_cottura: 10,
    tecnica: 'griglia',
    consiglio_chef: "La tagliata deve riposare quanto ha cotto — 5 minuti. Il riposo ridistribuisce i succhi e la carne resta succosa.",
    principio_nutrizionale: "Manzo magro (filetto, fesa) = 44g proteine con meno di 8g di grassi. Scegli sempre i tagli più magri.",
  },

  "Carne manzo magra__Quinoa / farro / orzo cotti__Olio d'oliva EVO": {
    nome: "Manzo grigliato con tabbouleh di quinoa",
    sottotitolo: "Mediterraneo orientale incontro all'italiana",
    ingredienti: [
      { nome: "Manzo magro", quantita: "200g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Prezzemolo abbondante", quantita: "1 mazzo" },
      { nome: "Pomodori", quantita: "150g" },
      { nome: "Limone", quantita: "1" },
    ],
    preparazione: [
      "Prepara il tabbouleh: quinoa fredda + prezzemolo tritato + pomodori + limone + metà olio.",
      "Griglia il manzo 3-4 min per lato, lascia riposare.",
      "Taglia la carne a strisce sottili contro le fibre.",
      "Componi il piatto con tabbouleh di quinoa e strisce di manzo.",
      "Aggiungi l'olio restante a crudo sulla carne.",
    ],
    tempo_prep: 20,
    tempo_cottura: 10,
    tecnica: 'griglia',
    consiglio_chef: "Il tabbouleh deve avere molto più prezzemolo che quinoa — è il prezzemolo il protagonista, non il cereale.",
    principio_nutrizionale: "Quinoa + manzo = profilo aminoacidico completo e complementare. Prezzemolo abbondante = vitamina C che aumenta l'assorbimento del ferro della carne.",
  },

  "Carne manzo magra__Lenticchie cotte__Olio d'oliva EVO": {
    nome: "Manzo con lenticchie in umido alle erbe",
    sottotitolo: "Uno stufato leggero, caldo e nutriente",
    ingredienti: [
      { nome: "Manzo magro a dadini", quantita: "200g" },
      { nome: "Lenticchie cotte", quantita: "180g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Pomodori pelati", quantita: "150g" },
      { nome: "Timo e alloro", quantita: "q.b." },
      { nome: "Carota e sedano", quantita: "100g" },
    ],
    preparazione: [
      "Rosola i dadini di manzo in padella senza olio a fuoco alto, 2 min per lato.",
      "Aggiungi carota e sedano tritati, cuoci 3 minuti.",
      "Unisci pomodori pelati, timo e alloro.",
      "Aggiungi le lenticchie e 100ml di acqua, copri e cuoci 15 minuti a fuoco basso.",
      "Aggiungi olio EVO a crudo, togli l'alloro prima di servire.",
    ],
    tempo_prep: 10,
    tempo_cottura: 25,
    tecnica: 'padella',
    consiglio_chef: "Rosola la carne senza olio a fuoco altissimo: si forma la crosticina (reazione di Maillard) che sigilla i succhi e aggiunge sapore.",
    principio_nutrizionale: "Ferro della carne rossa + vitamina C del pomodoro = assorbimento massimizzato. Lenticchie aggiungono fibre e proteine vegetali.",
  },

  // ──────────────────────────────────────────
  // MERLUZZO (BACCALÀ)
  // ──────────────────────────────────────────

  "Merluzzo salato secco__Patate / patata dolce cotte__Olio d'oliva EVO": {
    nome: "Baccalà con patate al vapore",
    sottotitolo: "La tradizione ligure-veneta, versione leggera",
    ingredienti: [
      { nome: "Merluzzo salato secco", quantita: "100g", note: "Ammollato 24-48h, acqua cambiata ogni 8h" },
      { nome: "Patate cotte al vapore", quantita: "200g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Prezzemolo fresco", quantita: "abbondante" },
      { nome: "Aglio", quantita: "1 spicchio" },
      { nome: "Limone", quantita: "½" },
    ],
    preparazione: [
      "ATTENZIONE: Ammolla il baccalà 24-48h in acqua fredda, cambiandola ogni 8 ore.",
      "Cuoci il baccalà ammollato al vapore 10-15 minuti finché si sfalda.",
      "Cuoci le patate al vapore separatamente.",
      "Trita aglio e prezzemolo finemente.",
      "Componi il piatto: patate, baccalà sfaldato, condimento aglio-prezzemolo-olio EVO-limone.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'vapore',
    consiglio_chef: "L'ammollo è non negoziabile: 24h minimo, 48h per baccalà molto salato. Cambiare l'acqua ogni 8h è fondamentale per non ritrovarsi con un piatto immangiabile.",
    principio_nutrizionale: "Baccalà = 47g proteine per 100g asciutto. Una delle fonti proteiche più concentrate disponibili.",
  },

  "Merluzzo salato secco__Fagioli rossi/bianchi/neri cotti__Olio d'oliva EVO": {
    nome: "Baccalà con fagioli bianchi all'italiana",
    sottotitolo: "Il piatto della vigilia, in versione quotidiana",
    ingredienti: [
      { nome: "Merluzzo salato secco", quantita: "100g", note: "Ammollato 24-48h" },
      { nome: "Fagioli cannellini cotti", quantita: "150g" },
      { nome: "Olio EVO", quantita: "10g" },
      { nome: "Salvia fresca", quantita: "4-5 foglie" },
      { nome: "Aglio", quantita: "2 spicchi" },
      { nome: "Pomodorini", quantita: "100g" },
    ],
    preparazione: [
      "Ammolla il baccalà 24-48h (cambia l'acqua ogni 8h).",
      "Cuoci il baccalà al vapore o in acqua non salata, 10-15 min.",
      "Soffriggi aglio e salvia in padella con metà dell'olio.",
      "Aggiungi i fagioli e i pomodorini, scalda 5 minuti.",
      "Unisci il baccalà sfaldato, manteca delicatamente. Olio EVO a crudo per finire.",
    ],
    tempo_prep: 10,
    tempo_cottura: 20,
    tecnica: 'misto',
    consiglio_chef: "Non salare mai l'acqua di cottura del baccalà ammollato — il sale residuo è già sufficiente.",
    principio_nutrizionale: "Tradizionale piatto povero italiano ricchissimo di proteine. Fagioli + baccalà = oltre 55g di proteine totali.",
  },

  // ──────────────────────────────────────────
  // EDAMAME
  // ──────────────────────────────────────────

  "Edamame (fagioli di soia)__Quinoa / farro / orzo cotti__Avocado": {
    nome: "Bowl verde di quinoa, edamame e avocado",
    sottotitolo: "100% vegetale, proteicamente completa",
    ingredienti: [
      { nome: "Edamame cotti", quantita: "200g" },
      { nome: "Quinoa cotta", quantita: "150g" },
      { nome: "Avocado", quantita: "75g" },
      { nome: "Spinaci freschi", quantita: "100g" },
      { nome: "Limone", quantita: "1" },
      { nome: "Sesamo tostato", quantita: "1 cucchiaino" },
    ],
    preparazione: [
      "Cuoci gli edamame surgelati al vapore 5 minuti, sgrana dai baccelli.",
      "Prepara la quinoa e lascia intiepidire.",
      "Taglia l'avocado a cubetti, irrora con limone.",
      "Componi la bowl: quinoa + spinaci crudi + edamame + avocado.",
      "Condisci con limone, sesamo tostato. L'avocado è il grasso.",
    ],
    tempo_prep: 10,
    tempo_cottura: 15,
    tecnica: 'vapore',
    consiglio_chef: "Il sesamo tostato non è decorativo — aggiunge calcio, grassi e sapore di nocciola. Tostalo tu in padella secca 2 minuti.",
    principio_nutrizionale: "Bowl completamente vegetale con profilo aminoacidico completo: quinoa + soia (edamame) = tutti gli aminoacidi essenziali.",
  },

  // ──────────────────────────────────────────
  // PROSCIUTTO COTTO
  // ──────────────────────────────────────────

  "Prosciutto cotto__Pasta integrale / di legumi cotta__Formaggio grattugiato": {
    nome: "Pasta integrale con prosciutto e formaggio",
    sottotitolo: "Comfort food proteico, versione equilibrata",
    ingredienti: [
      { nome: "Prosciutto cotto di qualità", quantita: "200g", note: "IGP, senza nitrati aggiunti" },
      { nome: "Pasta integrale o di legumi cotta", quantita: "150g" },
      { nome: "Formaggio grattugiato", quantita: "25g", note: "Parmigiano o gruyère" },
      { nome: "Piselli freschi o surgelati", quantita: "100g" },
      { nome: "Brodo vegetale", quantita: "50ml" },
    ],
    preparazione: [
      "Cuoci i piselli in acqua bollente 3 minuti, scola.",
      "Taglia il prosciutto a listarelle.",
      "Scalda la pasta nella stessa pentola con brodo e piselli, 2 minuti.",
      "Aggiungi il prosciutto a fuoco spento, mescola.",
      "Completa con formaggio grattugiato — il calore residuo lo fa sciogliere senza cuocerlo.",
    ],
    tempo_prep: 5,
    tempo_cottura: 10,
    tecnica: 'padella',
    consiglio_chef: "Aggiungi il prosciutto sempre a fuoco spento — il calore eccessivo lo indurisce e lo rende gommoso.",
    principio_nutrizionale: "Prosciutto cotto IGP = 36g proteine per 200g con qualità proteica elevata. Il formaggio aggiunge calcio e completa i grassi del pasto.",
  },

  "Prosciutto cotto__Pane integrale__Ricotta / sérac": {
    nome: "Tramezzino integrale prosciutto e ricotta",
    sottotitolo: "Pranzo da asporto, bilanciato e saporito",
    ingredienti: [
      { nome: "Prosciutto cotto", quantita: "200g" },
      { nome: "Pane integrale", quantita: "75g (2-3 fette)" },
      { nome: "Ricotta o sérac", quantita: "50g" },
      { nome: "Rucola o lattuga", quantita: "50g" },
      { nome: "Senape di Digione", quantita: "1 cucchiaino", note: "Facoltativa" },
      { nome: "Pomodoro", quantita: "1 medio" },
    ],
    preparazione: [
      "Spalma la ricotta sulle fette di pane (sostituisce il burro).",
      "Aggiungi senape se gradita.",
      "Distribuisci il prosciutto cotto sopra.",
      "Aggiungi rucola e fettine di pomodoro.",
      "Chiudi il tramezzino, taglia in diagonale.",
    ],
    tempo_prep: 5,
    tempo_cottura: 0,
    tecnica: 'crudo',
    consiglio_chef: "La ricotta spalma meglio se è a temperatura ambiente. È più leggera del burro ma più saporita della maionese.",
    principio_nutrizionale: "La ricotta aggiunge ulteriori proteine e calcio al pasto. Con prosciutto + ricotta superi i 40g di proteine senza cottura.",
  },

};

// ─────────────────────────────────────────
// Lookup function
// ─────────────────────────────────────────

export function getRicetta(proteina: string, fecola: string, grasso: string): Ricetta | null {
  const chiave = `${proteina}__${fecola}__${grasso}`;
  return RICETTE[chiave] ?? null;
}

// ─────────────────────────────────────────
// Principi cucina italiana (usati nel prompt generator)
// ─────────────────────────────────────────

export const PRINCIPI_CUCINA_ITALIANA = `
PRINCIPI CUCINA ITALIANA — Piano Serafino

TECNICHE CONSENTITE: vapore, griglia, forno, padella antiaderente, crudo
MAI: frittura, burro come grasso principale, panna intera

OLIO EVO: sempre a crudo o aggiunto a fine cottura. Quantità: 10g (1 cucchiaio) per pasto.
Eccezione: con proteine grasse (salmone, sgombro, uova) ridurre a 5g o omettere.

ERBE AROMATICHE ITALIANE da privilegiare: basilico, rosmarino, timo, origano, salvia, prezzemolo, menta, erba cipollina, alloro.

CONDIMENTO BASE: limone fresco (alcalinizzante), aglio, pepe nero, curcuma.

PROTEINE GRASSE (salmone, sgombro, uova): ridurre o eliminare la fonte di grasso aggiuntiva.
PROTEINE MAGRE (pollo, tonno, gamberi, bresaola, cottage): usare normalmente il grasso previsto.

VERDURE: sempre presenti, 300g per pasto (1/3 - ½ del piatto). Crude o cotte.
LEGUMI: doppia fonte (proteina + feculento), privilegiati per il loro profilo nutrizionale completo.
CEREALI: sempre integrali. Mai raffinati.

PORZIONI PRECISE: pesare sempre gli ingredienti. La precisione è parte del piano.
`;

export function STAGIONE_CORRENTE(): 'primavera' | 'estate' | 'autunno' | 'inverno' {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'primavera';
  if (m >= 6 && m <= 8) return 'estate';
  if (m >= 9 && m <= 11) return 'autunno';
  return 'inverno';
}

export const TOTALE_RICETTE = Object.keys(RICETTE).length;

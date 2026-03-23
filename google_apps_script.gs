// PIANO ALIMENTARE EMANUELE - Google Apps Script Backend
// Setup: esegui setupFogli() una volta, poi distribuisci come Web App
// Esegui come: Me | Accesso: Chiunque

const SHEET_PIANO   = "PIANO_SETTIMANALE";
const SHEET_SPESA   = "LISTA_SPESA";
const SHEET_CONFIG  = "CONFIGURAZIONE";

// Indici colonne PIANO_SETTIMANALE (0-based)
const COL_GIORNO          = 0;
const COL_COLAZIONE       = 1;
const COL_PRANZO_PROTEINA = 2;
const COL_PRANZO_FECOLA   = 3;
const COL_PRANZO_GRASSO   = 4;
const COL_PRANZO_PROT     = 5;
const COL_PRANZO_KCAL     = 6;
const COL_CENA_PROTEINA   = 7;
const COL_CENA_FECOLA     = 8;
const COL_CENA_GRASSO     = 9;
const COL_CENA_PROT       = 10;
const COL_CENA_KCAL       = 11;
const NUM_COLS_PIANO      = 12;

const INTESTAZIONE_PIANO = [
  "Giorno","Colazione",
  "Pranzo_Proteina","Pranzo_Fecola","Pranzo_Grasso","Pranzo_Prot","Pranzo_Kcal",
  "Cena_Proteina","Cena_Fecola","Cena_Grasso","Cena_Prot","Cena_Kcal"
];

const GIORNI = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];

// -- Entry points ------------------------------------------------------------

function doGet(e) {
  return handleRequest(e, null);
}

function doPost(e) {
  let body = null;
  try { body = JSON.parse(e.postData.contents); } catch(err) {}
  return handleRequest(e, body);
}

function handleRequest(e, body) {
  const params = (e && e.parameter) || {};
  const action = (body && body.action) || params.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let result;
  try {
    switch(action) {
      // -- Emanuele (nuovo schema) ------------------------------------------
      case "savePianoEmanuele":  result = savePianoEmanuele(ss, body.piano); break;
      case "getPianoEmanuele":   result = getPianoEmanuele(ss); break;
      case "updateComponente":   result = updateComponente(ss, body); break;

      // -- Compatibilità legacy --------------------------------------------
      case "getPiano":           result = getPiano(ss); break;
      case "savePiano":          result = savePiano(ss, body.piano); break;
      case "updatePasto":        result = updatePasto(ss, body); break;

      // -- Spesa ------------------------------------------------------------
      case "getSpesa":
      case "getListaSpesa":      result = getListaSpesa(ss); break;
      case "saveSpesa":
      case "saveListaSpesa":     result = saveListaSpesa(ss, body.spesa); break;
      case "spuntaSpesa":        result = spuntaSpesa(ss, body.ingrediente, body.spuntato); break;
      case "inviaMailSpesa":     result = inviaMailSpesa(ss, body.email, body.corpo, body.settimana); break;

      // -- Cache ricette (Groq) ---------------------------------------------
      case "getRicettaCache":    result = getRicettaCache(ss, params.chiave || (body&&body.chiave)); break;
      case "saveRicettaCache":   result = saveRicettaCache(ss, body.chiave, body.ricetta); break;

      // -- Profili ----------------------------------------------------------
      case "getProfili":         result = getProfili(ss); break;
      case "saveProfilo":        result = saveProfilo(ss, body.profilo); break;
      case "deleteProfilo":      result = deleteProfilo(ss, body.id); break;

      // -- Config ----------------------------------------------------------
      case "getConfig":          result = getConfig(ss); break;
      case "updateConfig":       result = updateConfig(ss, body); break;
      case "addEsclusione":      result = addEsclusione(ss, body.ingrediente); break;
      case "rimuoviEsclusione":  result = rimuoviEsclusione(ss, body.ingrediente); break;

      // -- Mensile ----------------------------------------------------------
      case "savePianoMensile":   result = savePianoMensile(ss, body.piano, body.anno, body.mese); break;
      case "getPianoMensile":    result = getPianoMensile(ss, (body&&body.anno)||params.anno, (body&&body.mese)||params.mese); break;
      case "salvaEccezione":     result = salvaEccezione(ss, body.data, body.eccezione, body.note, body.anno, body.mese); break;
      case "archiviaMese":       result = archiviaMese(ss, body.anno, body.mese); break;
      case "getArchivioMesi":    result = getArchivioMesi(ss); break;

      default: result = { error: "Azione non riconosciuta: " + action };
    }
  } catch(err) {
    result = { error: err.toString(), stack: err.stack };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// -- Salva piano Emanuele (schema completo 12 colonne) ------------------------

function savePianoEmanuele(ss, piano) {
  const sheet = ss.getSheetByName(SHEET_PIANO) || _creaFoglioConIntestazione(ss);
  sheet.clearContents();

  // Intestazione
  sheet.getRange(1, 1, 1, NUM_COLS_PIANO).setValues([INTESTAZIONE_PIANO]);
  sheet.getRange(1, 1, 1, NUM_COLS_PIANO)
       .setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");

  const righe = GIORNI.map(g => {
    const d = piano[g] || {};
    return [
      g,
      d.colazione        || "",
      d.pranzo_proteina  || "",
      d.pranzo_fecola    || "",
      d.pranzo_grasso    || "",
      d.pranzo_prot      || "",
      d.pranzo_kcal      || "",
      d.cena_proteina    || "",
      d.cena_fecola      || "",
      d.cena_grasso      || "",
      d.cena_prot        || "",
      d.cena_kcal        || "",
    ];
  });

  sheet.getRange(2, 1, righe.length, NUM_COLS_PIANO).setValues(righe);
  sheet.autoResizeColumns(1, NUM_COLS_PIANO);
  _aggiornaUltimaSync(ss);

  return { success: true };
}

// -- Leggi piano Emanuele ----------------------------------------------------

function getPianoEmanuele(ss) {
  const sheet = ss.getSheetByName(SHEET_PIANO);
  if(!sheet) return { piano: {} };

  const data = sheet.getDataRange().getValues();
  const piano = {};

  for(let i = 1; i < data.length; i++) {
    const r = data[i];
    if(!r[COL_GIORNO]) continue;
    piano[r[COL_GIORNO]] = {
      colazione:       r[COL_COLAZIONE]       || "",
      pranzo_proteina: r[COL_PRANZO_PROTEINA] || "",
      pranzo_fecola:   r[COL_PRANZO_FECOLA]   || "",
      pranzo_grasso:   r[COL_PRANZO_GRASSO]   || "",
      pranzo_prot:     r[COL_PRANZO_PROT]  !== "" ? Number(r[COL_PRANZO_PROT])  : null,
      pranzo_kcal:     r[COL_PRANZO_KCAL]  !== "" ? Number(r[COL_PRANZO_KCAL])  : null,
      cena_proteina:   r[COL_CENA_PROTEINA]   || "",
      cena_fecola:     r[COL_CENA_FECOLA]     || "",
      cena_grasso:     r[COL_CENA_GRASSO]     || "",
      cena_prot:       r[COL_CENA_PROT]   !== "" ? Number(r[COL_CENA_PROT])   : null,
      cena_kcal:       r[COL_CENA_KCAL]   !== "" ? Number(r[COL_CENA_KCAL])   : null,
    };
  }
  return { piano };
}

// -- Aggiorna singolo componente ----------------------------------------------

function updateComponente(ss, payload) {
  // payload: { giorno, pasto, tipo_comp, nuovo_valore }
  // pasto:     "pranzo" | "cena"
  // tipo_comp: "proteina" | "fecola" | "grasso"
  const sheet = ss.getSheetByName(SHEET_PIANO);
  if(!sheet) return { error: "Foglio non trovato" };

  const colMap = {
    pranzo_proteina: COL_PRANZO_PROTEINA + 1,
    pranzo_fecola:   COL_PRANZO_FECOLA   + 1,
    pranzo_grasso:   COL_PRANZO_GRASSO   + 1,
    cena_proteina:   COL_CENA_PROTEINA   + 1,
    cena_fecola:     COL_CENA_FECOLA     + 1,
    cena_grasso:     COL_CENA_GRASSO     + 1,
  };

  const chiave = payload.pasto + "_" + payload.tipo_comp;
  const col = colMap[chiave];
  if(!col) return { error: "Combinazione pasto/tipo_comp non valida: " + chiave };

  const riga = GIORNI.indexOf(payload.giorno) + 2;
  if(riga < 2) return { error: "Giorno non valido: " + payload.giorno };

  sheet.getRange(riga, col).setValue(payload.nuovo_valore);
  _aggiornaUltimaSync(ss);
  return { success: true };
}

// -- Helper privati ----------------------------------------------------------

function _creaFoglioConIntestazione(ss) {
  const sheet = ss.insertSheet(SHEET_PIANO);
  return sheet;
}

function _aggiornaUltimaSync(ss) {
  try {
    const sheet = ss.getSheetByName(SHEET_CONFIG);
    if(!sheet) return;
    const data = sheet.getDataRange().getValues();
    for(let i = 1; i < data.length; i++) {
      if(data[i][0] === "ULTIMA_SYNC") {
        sheet.getRange(i+1, 2).setValue(new Date().toISOString());
        return;
      }
    }
    sheet.appendRow(["ULTIMA_SYNC", new Date().toISOString()]);
  } catch(e) { /* non critico */ }
}

// -- Legacy: Leggi piano vecchio schema --------------------------------------

function getPiano(ss) {
  const sheet = ss.getSheetByName(SHEET_PIANO);
  if(!sheet) return { error: "Foglio " + SHEET_PIANO + " non trovato" };

  const data = sheet.getDataRange().getValues();
  const piano = {};

  for(let i = 1; i < data.length; i++) {
    const row = data[i];
    if(!row[0]) continue;
    piano[row[0]] = {
      colazione: row[1] || "",
      spuntino:  row[2] || "",
      pranzo:    row[3] || "",
      cena:      row[4] || "",
    };
  }
  return { piano };
}

// -- Legacy: Salva piano vecchio schema --------------------------------------

function savePiano(ss, piano) {
  const sheet = ss.getSheetByName(SHEET_PIANO) || ss.insertSheet(SHEET_PIANO);
  sheet.clearContents();

  sheet.getRange(1, 1, 1, 5).setValues([["Giorno","Colazione","Spuntino","Pranzo","Cena"]]);
  sheet.getRange(1, 1, 1, 5).setFontWeight("bold")
       .setBackground("#f4ede0").setFontColor("#4f6f52");

  const righe = GIORNI.map(g => [
    g,
    (piano[g] && piano[g].colazione) || "",
    (piano[g] && piano[g].spuntino)  || "",
    (piano[g] && piano[g].pranzo)    || "",
    (piano[g] && piano[g].cena)      || "",
  ]);
  sheet.getRange(2, 1, righe.length, 5).setValues(righe);
  sheet.autoResizeColumns(1, 5);

  return { success: true };
}

// -- Legacy: Aggiorna singolo pasto (vecchio schema) --------------------------

function updatePasto(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_PIANO);
  if(!sheet) return { error: "Foglio non trovato" };

  const colonnePasto = { colazione: 2, spuntino: 3, pranzo: 4, cena: 5 };
  const riga = GIORNI.indexOf(payload.giorno) + 2;
  const col  = colonnePasto[payload.tipo_pasto];

  if(riga < 2 || !col) return { error: "Giorno o tipo pasto non valido" };

  sheet.getRange(riga, col).setValue(payload.nuovo_valore);
  return { success: true };
}

// -- Invia mail lista spesa --------------------------------------------------

function inviaMailSpesa(ss, email, corpo, settimana) {
  if(!email || !email.includes('@')) return { error: "Email non valida" };
  const oggetto = "Lista Spesa Emanuele - " + (settimana || "");
  try {
    MailApp.sendEmail({
      to: email,
      subject: oggetto,
      body: corpo || "Lista spesa allegata.",
    });
    return { success: true };
  } catch(err) {
    return { error: err.toString() };
  }
}

// -- Lista della spesa --------------------------------------------------------

function getListaSpesa(ss) {
  const sheet = ss.getSheetByName(SHEET_SPESA);
  if(!sheet) return { spesa: [] };

  const data = sheet.getDataRange().getValues();
  const spesa = data.slice(1).filter(r => r[0]).map(r => ({
    ingrediente: r[0],
    quantita:    r[1],
    categoria:   r[2],
    spuntato:    r[3] === true || r[3] === "TRUE",
  }));

  return { spesa };
}

function saveListaSpesa(ss, spesa) {
  const sheet = ss.getSheetByName(SHEET_SPESA) || ss.insertSheet(SHEET_SPESA);
  sheet.clearContents();

  sheet.getRange(1, 1, 1, 4).setValues([["Ingrediente","Quantità","Categoria","Spuntato"]]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold")
       .setBackground("#f4ede0").setFontColor("#4f6f52");

  if(spesa && spesa.length) {
    const righe = spesa.map(item => [
      item.ingrediente,
      item.quantita  || "",
      item.categoria || "",
      item.spuntato  || false,
    ]);
    sheet.getRange(2, 1, righe.length, 4).setValues(righe);
    sheet.getRange(2, 4, righe.length, 1)
         .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  }
  sheet.autoResizeColumns(1, 4);
  return { success: true };
}

function spuntaSpesa(ss, ingrediente, spuntato) {
  const sheet = ss.getSheetByName(SHEET_SPESA);
  if(!sheet) return { error: "Foglio non trovato" };

  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === ingrediente) {
      sheet.getRange(i+1, 4).setValue(spuntato);
      return { success: true };
    }
  }
  return { error: "Ingrediente non trovato" };
}

// -- Configurazione ----------------------------------------------------------

function getConfig(ss) {
  const sheet = ss.getSheetByName(SHEET_CONFIG);
  if(!sheet) return initConfig(ss);

  const data = sheet.getDataRange().getValues();
  const config = {};
  data.slice(1).forEach(r => { if(r[0]) config[r[0]] = r[1]; });
  return { config };
}

function updateConfig(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_CONFIG) || ss.insertSheet(SHEET_CONFIG);
  const data  = sheet.getDataRange().getValues();

  const aggiorna = (chiave, valore) => {
    for(let i = 1; i < data.length; i++) {
      if(data[i][0] === chiave) {
        sheet.getRange(i+1, 2).setValue(valore);
        return;
      }
    }
    sheet.appendRow([chiave, valore]);
  };

  if(payload.stagione !== undefined) aggiorna("STAGIONE", payload.stagione);

  return { success: true };
}

function addEsclusione(ss, ingrediente) {
  const sheet = ss.getSheetByName(SHEET_CONFIG) || ss.insertSheet(SHEET_CONFIG);
  const data  = sheet.getDataRange().getValues();
  const ing   = ingrediente.toLowerCase().trim();

  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === "ESCLUSIONI") {
      const lista = data[i][1] ? data[i][1].toString().split(",").map(s => s.trim()).filter(Boolean) : [];
      if(!lista.includes(ing)) lista.push(ing);
      sheet.getRange(i+1, 2).setValue(lista.join(","));
      return { success: true, esclusioni: lista };
    }
  }
  sheet.appendRow(["ESCLUSIONI", ing]);
  return { success: true, esclusioni: [ing] };
}

function rimuoviEsclusione(ss, ingrediente) {
  const sheet = ss.getSheetByName(SHEET_CONFIG);
  if(!sheet) return { success: true, esclusioni: [] };

  const data = sheet.getDataRange().getValues();
  const ing  = ingrediente.toLowerCase().trim();

  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === "ESCLUSIONI") {
      const lista = data[i][1].toString().split(",").map(s => s.trim())
                               .filter(s => s && s !== ing);
      sheet.getRange(i+1, 2).setValue(lista.join(","));
      return { success: true, esclusioni: lista };
    }
  }
  return { success: true, esclusioni: [] };
}

// -- Utility ------------------------------------------------------------------

function initConfig(ss) {
  const existing = ss.getSheetByName(SHEET_CONFIG);
  const sheet = existing || ss.insertSheet(SHEET_CONFIG);
  if(!existing) {
    sheet.getRange(1, 1, 1, 2).setValues([["Chiave","Valore"]]);
    sheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");
    const defaults = [
      ["STAGIONE", "primavera"],
      ["ESCLUSIONI", ""],
      ["ULTIMA_SYNC", new Date().toISOString()],
    ];
    sheet.getRange(2, 1, defaults.length, 2).setValues(defaults);
    return { config: Object.fromEntries(defaults) };
  }
  return getConfig(ss);
}

// -- Setup iniziale (esegui una volta) ----------------------------------------

// Esegui setupFogli() una volta per creare la struttura dei fogli
function setupFogli() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // PIANO_SETTIMANALE (12 colonne - schema Emanuele)
  let sheet = ss.getSheetByName(SHEET_PIANO) || ss.insertSheet(SHEET_PIANO);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, NUM_COLS_PIANO).setValues([INTESTAZIONE_PIANO]);
  sheet.getRange(1, 1, 1, NUM_COLS_PIANO)
       .setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");
  GIORNI.forEach((g, i) => sheet.getRange(i+2, 1).setValue(g));
  sheet.autoResizeColumns(1, NUM_COLS_PIANO);

  // LISTA_SPESA
  sheet = ss.getSheetByName(SHEET_SPESA) || ss.insertSheet(SHEET_SPESA);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, 4).setValues([["Ingrediente","Quantità","Categoria","Spuntato"]]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");

  // CONFIGURAZIONE
  initConfig(ss);

  SpreadsheetApp.getUi().alert(
    "✅ Fogli creati!\n\n" +
    "Ora distribuisci come Web App:\n" +
    "Distribuisci → Nuova distribuzione → Web App\n" +
    "Esegui come: Me | Accesso: Chiunque"
  );
}

// ---
// MENSILE
// Schema foglio PIANO_MENSILE_YYYY_MM (16 colonne):
// Data | Giorno | GiornoNome | Tipo | Pranzo_Proteina | Pranzo_Fecola |
// Pranzo_Grasso | Pranzo_Prot | Pranzo_Kcal | Cena_Proteina | Cena_Fecola |
// Cena_Grasso | Cena_Prot | Cena_Kcal | Eccezione | Note_Eccezione
// ---

const INTESTAZIONE_MENSILE = [
  "Data","Giorno","GiornoNome","Tipo",
  "Pranzo_Proteina","Pranzo_Fecola","Pranzo_Grasso","Pranzo_Prot","Pranzo_Kcal",
  "Cena_Proteina","Cena_Fecola","Cena_Grasso","Cena_Prot","Cena_Kcal",
  "Eccezione","Note_Eccezione"
];

function _nomeFoglioMensile(anno, mese) {
  return "PIANO_MENSILE_" + anno + "_" + String(mese).padStart(2,"0");
}

function _nomeArchivio(anno, mese) {
  return "ARCHIVIO_" + anno + "_" + String(mese).padStart(2,"0");
}

// -- Salva piano mensile ----------------------------------------------------
function savePianoMensile(ss, piano, anno, mese) {
  const nome = _nomeFoglioMensile(anno, mese);
  let sheet = ss.getSheetByName(nome);
  if(!sheet) {
    sheet = ss.insertSheet(nome);
  }
  sheet.clearContents();
  sheet.getRange(1, 1, 1, INTESTAZIONE_MENSILE.length).setValues([INTESTAZIONE_MENSILE]);
  sheet.getRange(1, 1, 1, INTESTAZIONE_MENSILE.length)
       .setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");

  const rows = [];
  const isoKeys = Object.keys(piano).sort();
  for(const iso of isoKeys) {
    const d = piano[iso];
    const p = d.pranzo || {};
    const c = d.cena || {};
    rows.push([
      iso,
      d.giorno || "",
      d.giorno_nome || "",
      d.tipo || "",
      p.proteina || "", p.fecola || "", p.grasso || "",
      (p.macro && p.macro.prot) || "", (p.macro && p.macro.kcal) || "",
      c.speciale ? ("Speciale:"+c.speciale) : (c.proteina || ""),
      c.fecola || "", c.grasso || "",
      (c.macro && c.macro.prot) || "", (c.macro && c.macro.kcal) || "",
      d.eccezione ? "SI" : "",
      d.note_eccezione || "",
    ]);
  }
  if(rows.length > 0) {
    sheet.getRange(2, 1, rows.length, INTESTAZIONE_MENSILE.length).setValues(rows);
  }
  sheet.autoResizeColumns(1, INTESTAZIONE_MENSILE.length);
  _aggiornaUltimaSync(ss);
  return { success: true, giorni: rows.length, foglio: nome };
}

// -- Leggi piano mensile ----------------------------------------------------
function getPianoMensile(ss, anno, mese) {
  const nome = _nomeFoglioMensile(anno, mese);
  const sheet = ss.getSheetByName(nome);
  if(!sheet) return { piano: {} };

  const data = sheet.getDataRange().getValues();
  if(data.length < 2) return { piano: {} };

  const piano = {};
  for(let i = 1; i < data.length; i++) {
    const row = data[i];
    const iso = row[0] ? row[0].toString() : null;
    if(!iso) continue;
    piano[iso] = {
      data: iso,
      giorno: row[1],
      giorno_nome: row[2],
      tipo: row[3],
      pranzo: {
        proteina: row[4] || "", fecola: row[5] || "", grasso: row[6] || "",
        macro: { prot: row[7] || 0, kcal: row[8] || 0 },
      },
      cena: {
        speciale: (row[9]||"").startsWith("Speciale:") ? row[9].replace("Speciale:","") : null,
        proteina: !(row[9]||"").startsWith("Speciale:") ? (row[9]||"") : null,
        fecola: row[10] || "", grasso: row[11] || "",
        macro: { prot: row[12] || 0, kcal: row[13] || 0 },
      },
      eccezione: row[14] === "SI",
      note_eccezione: row[15] || "",
    };
  }
  return { piano: piano, foglio: nome };
}

// -- Salva eccezione singolo giorno ----------------------------------------
function salvaEccezione(ss, dataIso, eccezione, note, anno, mese) {
  const nome = _nomeFoglioMensile(anno, mese);
  const sheet = ss.getSheetByName(nome);
  if(!sheet) return { error: "Foglio " + nome + " non trovato" };

  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] && data[i][0].toString() === dataIso) {
      sheet.getRange(i+1, 15).setValue(eccezione ? "SI" : "");
      sheet.getRange(i+1, 16).setValue(note || "");
      return { success: true, data: dataIso };
    }
  }
  return { error: "Data " + dataIso + " non trovata nel foglio" };
}

// -- Archivia mese (rinomina foglio) ----------------------------------------
function archiviaMese(ss, anno, mese) {
  const nomePiano   = _nomeFoglioMensile(anno, mese);
  const nomeArchivio = _nomeArchivio(anno, mese);

  const sheet = ss.getSheetByName(nomePiano);
  if(!sheet) return { error: "Foglio " + nomePiano + " non trovato" };

  // Se esiste già un archivio con quel nome, cancellalo
  const existing = ss.getSheetByName(nomeArchivio);
  if(existing) ss.deleteSheet(existing);

  sheet.setName(nomeArchivio);
  return { success: true, archivio: nomeArchivio };
}

// -- Lista archivi ----------------------------------------------------------
function getArchivioMesi(ss) {
  const sheets = ss.getSheets();
  const archivi = sheets
    .filter(s => s.getName().startsWith("ARCHIVIO_"))
    .map(s => s.getName())
    .sort();
  return { archivi: archivi };
}

// -- Cache ricette Groq -----------------------------------------------------
// Foglio RICETTE_CACHE: Chiave | JSON_Ricetta | Timestamp

const SHEET_RICETTE = "RICETTE_CACHE";

function getRicettaCache(ss, chiave) {
  if(!chiave) return { ricetta: null };
  const sheet = ss.getSheetByName(SHEET_RICETTE);
  if(!sheet) return { ricetta: null };

  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === chiave) {
      try {
        const ricetta = JSON.parse(data[i][1]);
        return { ricetta: ricetta };
      } catch(e) {
        return { ricetta: null };
      }
    }
  }
  return { ricetta: null };
}

function saveRicettaCache(ss, chiave, ricetta) {
  if(!chiave || !ricetta) return { error: "chiave o ricetta mancante" };

  let sheet = ss.getSheetByName(SHEET_RICETTE);
  if(!sheet) {
    sheet = ss.insertSheet(SHEET_RICETTE);
    sheet.getRange(1, 1, 1, 3).setValues([["Chiave","Ricetta_JSON","Timestamp"]]);
    sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");
  }

  const json = JSON.stringify(ricetta);
  const ts   = new Date().toISOString();

  // Aggiorna se esiste già
  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === chiave) {
      sheet.getRange(i+1, 2).setValue(json);
      sheet.getRange(i+1, 3).setValue(ts);
      return { success: true, aggiornata: true };
    }
  }

  // Altrimenti append
  sheet.appendRow([chiave, json, ts]);
  return { success: true, aggiornata: false };
}

// -- Profili ----------------------------------------------------------------
// Foglio PROFILI: id | nome | cognome | peso_kg | altezza_cm | eta | sesso |
//                 nutrizionista | fase_attiva | creato_il | json_extra

const SHEET_PROFILI = "PROFILI";
const INTESTAZIONE_PROFILI = [
  "id","nome","cognome","peso_kg","altezza_cm","eta","sesso",
  "nutrizionista","fase_attiva","creato_il"
];

function getProfili(ss) {
  const sheet = ss.getSheetByName(SHEET_PROFILI);
  if(!sheet) return { profili: [] };

  const data = sheet.getDataRange().getValues();
  if(data.length < 2) return { profili: [] };

  const heads = data[0];
  const profili = data.slice(1).filter(r => r[0]).map(r => {
    const obj = {};
    heads.forEach((h, i) => { obj[h] = r[i] !== undefined ? r[i] : ""; });
    // Conversioni numeriche
    if(obj.peso_kg)     obj.peso_kg     = Number(obj.peso_kg);
    if(obj.altezza_cm)  obj.altezza_cm  = Number(obj.altezza_cm);
    if(obj.eta)         obj.eta         = Number(obj.eta);
    return obj;
  });

  return { profili: profili };
}

function saveProfilo(ss, profilo) {
  if(!profilo || !profilo.id) return { error: "Profilo non valido" };

  let sheet = ss.getSheetByName(SHEET_PROFILI);
  if(!sheet) {
    sheet = ss.insertSheet(SHEET_PROFILI);
    sheet.getRange(1, 1, 1, INTESTAZIONE_PROFILI.length).setValues([INTESTAZIONE_PROFILI]);
    sheet.getRange(1, 1, 1, INTESTAZIONE_PROFILI.length)
         .setFontWeight("bold").setBackground("#f4ede0").setFontColor("#4f6f52");
  }

  const riga = [
    profilo.id          || "",
    profilo.nome        || "",
    profilo.cognome     || "",
    profilo.peso_kg     || "",
    profilo.altezza_cm  || "",
    profilo.eta         || "",
    profilo.sesso       || "M",
    profilo.nutrizionista || "Serafino",
    profilo.fase_attiva || "mantenimento",
    profilo.creato_il   || new Date().toISOString().slice(0,10),
  ];

  // Aggiorna se esiste già
  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === profilo.id) {
      sheet.getRange(i+1, 1, 1, riga.length).setValues([riga]);
      return { success: true, aggiornato: true };
    }
  }

  // Altrimenti append
  sheet.appendRow(riga);
  sheet.autoResizeColumns(1, INTESTAZIONE_PROFILI.length);
  return { success: true, aggiornato: false };
}

function deleteProfilo(ss, id) {
  if(!id) return { error: "id mancante" };

  const sheet = ss.getSheetByName(SHEET_PROFILI);
  if(!sheet) return { error: "Foglio profili non trovato" };

  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] === id) {
      sheet.deleteRow(i+1);
      return { success: true };
    }
  }
  return { error: "Profilo " + id + " non trovato" };
}

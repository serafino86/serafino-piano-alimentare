#!/usr/bin/env python3
"""
Piano Alimentare - Emanuele RIPICCINI
Nutrizionista: Adélaïde Bellenot (abnutrition.ch)

Target: 2g/kg = 178g proteine/giorno
        620 kcal + 53g proteine per pasto principale (pranzo e cena)

Uso: python3 meal_planner.py
Output: piano_emanuele_YYYY-Www.html
"""

import json, random, os, argparse, calendar as cal_module
from datetime import date, timedelta
from math import ceil
from collections import defaultdict

APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOv5MZHXQjV-kG0wWPsIfI1FhH4MnHhLBRFc-GpErR80l-8tF23rA_JUUaJtdL2fWr/exec"

PAZIENTE = {
    "nome": "Emanuele RIPICCINI",
    "eta": 38, "altezza_cm": 178, "peso_kg": 87.38,
    "target_prot_giorno": 178,
    "target_kcal_pasto": 620,
    "target_prot_pasto": 53,
}

# ═══════════════════════════════════════════════════════
# OPZIONI COMPONENTI (dal programma della dottoressa)
# ═══════════════════════════════════════════════════════

PROTEINE = {
    "Tonno al naturale": {
        "q_str": "160g", "q": 160, "u": "g",
        "prot": 46, "kcal": 160, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "In lattina, sgocciolato e asciugato",
        "alt": ["Merluzzo salato secco", "Gamberi / scampi", "Petto di pollo"]
    },
    "Petto di pollo / tacchino": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 44, "kcal": 220, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Griglia, vapore o forno. Marinare con limone e erbe.",
        "alt": ["Prosciutto cotto", "Viande des Grisons", "Tonno al naturale"]
    },
    "Salmone affumicato sockeye": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 40, "kcal": 280, "tipo": "grassa",
        "cat_spesa": "Pesce e carne",
        "note": "⚠️ Proteina grassa → ridurre/eliminare fonte di grasso aggiuntiva",
        "alt": ["Tonno al naturale", "Sgombro al naturale", "Salmone fresco"]
    },
    "Uova grandi (L)": {
        "q_str": "4 pz + 2 albumi", "q": 4, "u": "pz",
        "prot": 28, "kcal": 280, "tipo": "grassa",
        "cat_spesa": "Uova",
        "note": "⚠️ Proteina grassa → ridurre fonte di grasso aggiuntiva",
        "alt": ["Cottage cheese", "Frittata al forno", "Uova strapazzate"]
    },
    "Cottage cheese": {
        "q_str": "400g", "q": 400, "u": "g",
        "prot": 48, "kcal": 280, "tipo": "magra",
        "cat_spesa": "Latticini",
        "note": "Opzione versatile, si abbina a verdure o frutta",
        "alt": ["Skyr / séré maigre", "Fiocchi di latte magri", "Tofu"]
    },
    "Tofu": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 20, "kcal": 160, "tipo": "magra",
        "cat_spesa": "Vegetale proteico",
        "note": "Marinare con salsa soia + aglio. Rosolare bene.",
        "alt": ["Edamame", "Tempeh", "Cottage cheese"]
    },
    "Viande des Grisons (bresaola)": {
        "q_str": "100g", "q": 100, "u": "g",
        "prot": 32, "kcal": 140, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Affettato magro svizzero, ottimo freddo in insalata",
        "alt": ["Prosciutto cotto", "Petto di tacchino affettato", "Tonno al naturale"]
    },
    "Prosciutto cotto": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 36, "kcal": 280, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Qualità alta, senza additivi (es. IGP)",
        "alt": ["Viande des Grisons", "Petto di pollo / tacchino", "Tonno al naturale"]
    },
    "Merluzzo salato secco": {
        "q_str": "100g", "q": 100, "u": "g",
        "prot": 47, "kcal": 190, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Ammollare 24-48h cambiando acqua ogni 8h",
        "alt": ["Tonno al naturale", "Platessa al vapore", "Gamberi / scampi"]
    },
    "Edamame (fagioli di soia)": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 26, "kcal": 280, "tipo": "magra",
        "cat_spesa": "Vegetale proteico",
        "note": "Surgelati, vapore 5 min. Ottimi con salsa soia.",
        "alt": ["Tofu", "Lenticchie", "Cottage cheese"]
    },
    "Gamberi / scampi": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 40, "kcal": 180, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Saltare in padella con aglio e prezzemolo.",
        "alt": ["Tonno al naturale", "Merluzzo salato secco", "Calamari"]
    },
    "Sgombro al naturale": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 38, "kcal": 300, "tipo": "grassa",
        "cat_spesa": "Pesce e carne",
        "note": "⚠️ Proteina grassa → ridurre fonte di grasso aggiuntiva",
        "alt": ["Tonno al naturale", "Salmone affumicato sockeye", "Sardine"]
    },
    "Carne manzo magra": {
        "q_str": "200g", "q": 200, "u": "g",
        "prot": 44, "kcal": 260, "tipo": "magra",
        "cat_spesa": "Pesce e carne",
        "note": "Scelte magre: filetto, fesa, noce. Griglia o forno.",
        "alt": ["Petto di pollo / tacchino", "Tonno al naturale", "Prosciutto cotto"]
    },
}

FECULENTI = {
    "Pasta integrale / di legumi cotta": {
        "q_str": "150g (cotta)", "q": 150, "u": "g",
        "prot": 7, "kcal": 180, "cat_spesa": "Pasta e cereali",
        "note": "150g cotta = ~60g cruda. Preferire pasta di legumi per +proteine.",
        "alt": ["Riso integrale cotto", "Quinoa / farro / orzo cotti", "Polenta cotta"],
    },
    "Riso integrale cotto": {
        "q_str": "150g (cotto)", "q": 150, "u": "g",
        "prot": 4, "kcal": 180, "cat_spesa": "Pasta e cereali",
        "note": "150g cotto = ~60g crudo. Cuocere in brodo vegetale.",
        "alt": ["Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti", "Polenta cotta"],
    },
    "Patate / patata dolce cotte": {
        "q_str": "200g (cotte)", "q": 200, "u": "g",
        "prot": 4, "kcal": 170, "cat_spesa": "Verdura e tuberi",
        "note": "Forno, vapore o bollite. No fritte.",
        "alt": ["Riso integrale cotto", "Mais in chicchi cotto", "Castagne cotte"],
    },
    "Lenticchie cotte": {
        "q_str": "180g (cotte)", "q": 180, "u": "g",
        "prot": 18, "kcal": 200, "cat_spesa": "Legumi",
        "note": "Anche fonte proteica! Ottimo con curcuma e spezie.",
        "alt": ["Fagioli rossi/bianchi/neri cotti", "Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti"],
    },
    "Pane integrale": {
        "q_str": "75g", "q": 75, "u": "g",
        "prot": 9, "kcal": 185, "cat_spesa": "Pane",
        "note": "Scegliere pane con <5% zuccheri. Farro o segale.",
        "alt": ["Riso integrale cotto", "Pasta integrale / di legumi cotta", "Patate / patata dolce cotte"],
    },
    "Polenta cotta": {
        "q_str": "240g (cotta)", "q": 240, "u": "g",
        "prot": 5, "kcal": 200, "cat_spesa": "Pasta e cereali",
        "note": "240g cotta = ~60g farina di mais. Con funghi o verdure.",
        "alt": ["Riso integrale cotto", "Quinoa / farro / orzo cotti", "Patate / patata dolce cotte"],
    },
    "Fagioli rossi/bianchi/neri cotti": {
        "q_str": "150g (cotti)", "q": 150, "u": "g",
        "prot": 12, "kcal": 175, "cat_spesa": "Legumi",
        "note": "Anche fonte proteica. In lattina o secchi.",
        "alt": ["Lenticchie cotte", "Pasta integrale / di legumi cotta", "Quinoa / farro / orzo cotti"],
    },
    "Castagne cotte": {
        "q_str": "100g", "q": 100, "u": "g",
        "prot": 3, "kcal": 200, "cat_spesa": "Frutta secca",
        "note": "Stagionale (autunno/inverno). Ottimo con formaggi.",
        "alt": ["Patate / patata dolce cotte", "Riso integrale cotto", "Mais in chicchi cotto"],
    },
    "Mais in chicchi cotto": {
        "q_str": "165g", "q": 165, "u": "g",
        "prot": 5, "kcal": 180, "cat_spesa": "Verdura e tuberi",
        "note": "In lattina o surgelato. Ottimo in insalata.",
        "alt": ["Patate / patata dolce cotte", "Riso integrale cotto", "Quinoa / farro / orzo cotti"],
    },
    "Quinoa / farro / orzo cotti": {
        "q_str": "150g (cotti)", "q": 150, "u": "g",
        "prot": 7, "kcal": 185, "cat_spesa": "Pasta e cereali",
        "note": "150g cotto. Ottimo in insalata fredda.",
        "alt": ["Riso integrale cotto", "Pasta integrale / di legumi cotta", "Polenta cotta"],
    },
}

GRASSI = {
    "Olio d'oliva EVO": {
        "q_str": "10g (1 CAS)", "q": 10, "u": "g",
        "prot": 0, "kcal": 90, "cat_spesa": "Condimenti",
        "note": "Misurare con cucchiaio per precisione.",
        "alt": ["Avocado", "Olive (18 unità)", "Semi misti"],
    },
    "Avocado": {
        "q_str": "~75g (1/2 avocado)", "q": 75, "u": "g",
        "prot": 1, "kcal": 120, "cat_spesa": "Frutta e verdura",
        "note": "A fette su insalata o schiacciato come base.",
        "alt": ["Olio d'oliva EVO", "Hummus (1 CAS grande)", "Oleaginosi"],
    },
    "Semi misti": {
        "q_str": "15g (1.5 CAS)", "q": 15, "u": "g",
        "prot": 3, "kcal": 90, "cat_spesa": "Semi e frutta secca",
        "note": "Mix: chia, lino, zucca, girasole.",
        "alt": ["Oleaginosi", "Burro di arachidi 100%", "Olio d'oliva EVO"],
    },
    "Olive (18 unità)": {
        "q_str": "54g (~18 olive)", "q": 54, "u": "g",
        "prot": 0, "kcal": 75, "cat_spesa": "Condimenti",
        "note": "Denocciolate. In insalata o come goûter.",
        "alt": ["Avocado", "Oleaginosi", "Olio d'oliva EVO"],
    },
    "Formaggio grattugiato": {
        "q_str": "25g", "q": 25, "u": "g",
        "prot": 5, "kcal": 90, "cat_spesa": "Latticini",
        "note": "Parmigiano, gruyère, emmental. Su pasta o verdure.",
        "alt": ["Mozzarella", "Ricotta / sérac", "Pesto"],
    },
    "Oleaginosi": {
        "q_str": "15g (1 manciata)", "q": 15, "u": "g",
        "prot": 3, "kcal": 90, "cat_spesa": "Semi e frutta secca",
        "note": "Noci, mandorle, anacardi. Una piccola manciata.",
        "alt": ["Semi misti", "Burro di arachidi 100%", "Avocado"],
    },
    "Burro di arachidi 100%": {
        "q_str": "15g (1 CAS)", "q": 15, "u": "g",
        "prot": 4, "kcal": 90, "cat_spesa": "Condimenti",
        "note": "Solo 100% arachidi, zero zuccheri aggiunti.",
        "alt": ["Oleaginosi", "Semi misti", "Avocado"],
    },
    "Crème à cuisiner allégée": {
        "q_str": "90g", "q": 90, "u": "g",
        "prot": 3, "kcal": 90, "cat_spesa": "Latticini",
        "note": "Per salse cremose. Verificare % grassi (<15%).",
        "alt": ["Ricotta / sérac", "Formaggio grattugiato", "Olio d'oliva EVO"],
    },
    "Latte di cocco allégé": {
        "q_str": "95ml", "q": 95, "u": "ml",
        "prot": 1, "kcal": 90, "cat_spesa": "Latticini vegetali",
        "note": "In lattina. Per curry o piatti esotici.",
        "alt": ["Crème à cuisiner allégée", "Olio d'oliva EVO", "Ricotta / sérac"],
    },
    "Hummus (1 CAS grande)": {
        "q_str": "60g (1 CAS grande)", "q": 60, "u": "g",
        "prot": 3, "kcal": 90, "cat_spesa": "Condimenti",
        "note": "Anche come spuntino o base per verdure.",
        "alt": ["Avocado", "Oleaginosi", "Burro di arachidi 100%"],
    },
    "Mozzarella": {
        "q_str": "40g", "q": 40, "u": "g",
        "prot": 3, "kcal": 100, "cat_spesa": "Latticini",
        "note": "Con insalata, pasta o come goûter.",
        "alt": ["Formaggio grattugiato", "Ricotta / sérac", "Crème à cuisiner allégée"],
    },
    "Ricotta / sérac": {
        "q_str": "50g", "q": 50, "u": "g",
        "prot": 4, "kcal": 90, "cat_spesa": "Latticini",
        "note": "Su verdure, pane o come condimento pasta.",
        "alt": ["Mozzarella", "Formaggio grattugiato", "Crème à cuisiner allégée"],
    },
    "Pesto": {
        "q_str": "25g (1 CAS)", "q": 25, "u": "g",
        "prot": 2, "kcal": 100, "cat_spesa": "Condimenti",
        "note": "Pesto genovese classico o di rucola.",
        "alt": ["Olio d'oliva EVO", "Formaggio grattugiato", "Hummus (1 CAS grande)"],
    },
}

# ═══════════════════════════════════════════════════════
# COLAZIONI FISSE PER TIPO DI GIORNO
# ═══════════════════════════════════════════════════════

COLAZIONI = {
    "LMV": {
        "nome": "Colazione con uova (con tempo)",
        "orario": "07:00",
        "componenti": [
            "2 uova grandi (L) + 2 albumi",
            "100g cottage cheese",
            "½ avocado  OPPURE  1 CAS grande hummus",
            "max 1 cac olio d'oliva per cottura (meno = meglio)",
        ],
        "opzioni": [
            {"nome": "Uova strapazzate classiche", "descr": "2 uova + 2 albumi + 100g cottage cheese + ½ avocado o hummus", "prot": 35, "kcal": 400},
            {"nome": "Frittata di verdure al forno", "descr": "3 uova + spinaci/pomodorini + 30g formaggio grattugiato + erbe aromatiche", "prot": 33, "kcal": 390},
            {"nome": "Uova alla coque con skyr", "descr": "2 uova alla coque + 150g skyr o séré magro + frutto di stagione", "prot": 34, "kcal": 380},
            {"nome": "Omelette al salmone", "descr": "2 uova + 60g salmone affumicato + erbe + 50g cottage cheese", "prot": 36, "kcal": 370},
            {"nome": "Toast proteico", "descr": "2 fette pane integrale (80g) + 2 uova + 80g ricotta o cottage cheese + pomodoro", "prot": 33, "kcal": 420},
            {"nome": "Shakshuka leggera", "descr": "2 uova in salsa pomodoro-peperone + 50g pane integrale + 50g cottage cheese", "prot": 30, "kcal": 400},
        ],
        "spesa": {
            "Uova grandi (L)": {"q": 4, "u": "pz", "cat": "Uova"},
            "Cottage cheese": {"q": 100, "u": "g", "cat": "Latticini"},
            "Avocado": {"q": 75, "u": "g", "cat": "Frutta e verdura"},
        },
        "macro": {"prot": 35, "kcal": 400},
    },
    "MT": {
        "nome": "Colazione rapida (shake proteico)",
        "orario": "07:00",
        "componenti": [
            "50g cereali integrali a scelta",
            "1 scoop whey protein (30g) + 200ml latte mandorla ss zucchero",
            "frutta a scelta",
            "1 manciata oleaginosi (15g)  OPPURE  2 CAS semi chia (20g)",
            "cannella in polvere",
        ],
        "opzioni": [
            {"nome": "Shake classico con cereali", "descr": "50g cereali + 30g whey + 200ml latte mandorla + frutta + 15g oleaginosi", "prot": 38, "kcal": 380},
            {"nome": "Porridge proteico", "descr": "50g fiocchi avena cotti + 30g whey mescolato + frutti di bosco + 15g noci", "prot": 36, "kcal": 390},
            {"nome": "Skyr bowl", "descr": "200g skyr o yogurt greco + 50g muesli ss zucchero + banana + 15g mandorle", "prot": 35, "kcal": 400},
            {"nome": "Smoothie proteico", "descr": "150g yogurt greco 0% + 1 frutto + 30g whey + 200ml latte mandorla + semi chia", "prot": 40, "kcal": 370},
            {"nome": "Overnight oats", "descr": "40g avena + 200ml latte mandorla (riposo notte) + 100g cottage cheese + frutti rossi", "prot": 34, "kcal": 380},
            {"nome": "Pane di segale con ricotta", "descr": "2 fette pane segale (80g) + 100g ricotta magra + frutti rossi + 1 cac miele", "prot": 28, "kcal": 360},
        ],
        "nota": "Alternativa: sostituire whey + latte con 200g yogurt proteico",
        "spesa": {
            "Cereali integrali": {"q": 50, "u": "g", "cat": "Cereali"},
            "Whey protein": {"q": 30, "u": "g", "cat": "Integratori"},
            "Latte di mandorla ss zucchero": {"q": 200, "u": "ml", "cat": "Latticini vegetali"},
            "Frutta fresca": {"q": 150, "u": "g", "cat": "Frutta"},
            "Oleaginosi": {"q": 15, "u": "g", "cat": "Semi e frutta secca"},
        },
        "macro": {"prot": 38, "kcal": 380},
    },
    "SAB": {
        "nome": "Colazione pancakes proteici / avena",
        "orario": "07:00",
        "componenti": [
            "OPZIONE A: 1 porzione pancakes proteici alla banana (249g)",
            "OPZIONE B: 1 porzione fiocchi d'avena imbevuti grande (292g)",
        ],
        "opzioni": [
            {"nome": "Pancakes proteici alla banana", "descr": "249g totali: banana + 2 uova + 30g whey + farina avena + lievito. Ricetta abnutrition.ch", "prot": 30, "kcal": 420},
            {"nome": "Porridge di avena imbevuto", "descr": "292g: 100g avena + 200ml latte mandorla + banana + frutti rossi. Riposo 10 min.", "prot": 28, "kcal": 410},
            {"nome": "French toast integrale", "descr": "2 fette pane integrale bagnate in 2 uova + cannella + cotte in padella + 100g cottage cheese", "prot": 32, "kcal": 430},
            {"nome": "Crepes proteiche", "descr": "2 crepes: 40g farina avena + 2 uova + 100ml latte mandorla + 50g ricotta + frutti rossi", "prot": 31, "kcal": 400},
            {"nome": "Smoothie bowl", "descr": "Base: banana congelata + 30g whey + latte mandorla. Topping: 30g granola + semi + frutti", "prot": 29, "kcal": 420},
            {"nome": "Waffles proteici", "descr": "Come pancakes ma in waflera: 40g farina avena + 2 uova + 30g whey + 100ml latte mandorla", "prot": 33, "kcal": 415},
        ],
        "nota": "Ricette a fine programma (sito abnutrition.ch)",
        "spesa": {
            "Fiocchi d'avena": {"q": 100, "u": "g", "cat": "Cereali"},
            "Banane": {"q": 1, "u": "pz", "cat": "Frutta"},
            "Uova grandi (L)": {"q": 2, "u": "pz", "cat": "Uova"},
            "Whey protein": {"q": 30, "u": "g", "cat": "Integratori"},
        },
        "macro": {"prot": 30, "kcal": 420},
    },
    "DOM": {
        "nome": "Colazione beans",
        "orario": "07:00",
        "componenti": [
            "150g fagioli rossi/bianchi/neri cotti",
            "150g cottage cheese  OPPURE  skyr / séré magro",
            "½ avocado",
            "+ verdure a scelta",
        ],
        "opzioni": [
            {"nome": "Beans classica", "descr": "150g fagioli + 150g cottage cheese + ½ avocado + verdure a piacere", "prot": 32, "kcal": 400},
            {"nome": "Lenticchie e skyr", "descr": "200g lenticchie rosse cotte + 150g skyr + ½ avocado + rucola + pomodorini", "prot": 35, "kcal": 420},
            {"nome": "Ceci con cottage cheese", "descr": "150g ceci cotti + 100g cottage cheese + pomodorini + basilico + 1 filo olio EVO", "prot": 30, "kcal": 390},
            {"nome": "Shakshuka beans", "descr": "2 uova in salsa pomodoro + 100g fagioli neri + 50g pane integrale + prezzemolo", "prot": 31, "kcal": 410},
            {"nome": "Tofu scramble", "descr": "150g tofu sbriciolato + curcuma + 100g fagioli + peperone saltato + erbe aromatiche", "prot": 28, "kcal": 370},
            {"nome": "Bowl proteica domenicale", "descr": "100g edamame + 100g ceci + 100g cottage cheese + ½ avocado + semi misti", "prot": 34, "kcal": 410},
        ],
        "spesa": {
            "Fagioli rossi/bianchi/neri cotti": {"q": 150, "u": "g", "cat": "Legumi"},
            "Cottage cheese": {"q": 150, "u": "g", "cat": "Latticini"},
            "Avocado": {"q": 75, "u": "g", "cat": "Frutta e verdura"},
        },
        "macro": {"prot": 32, "kcal": 400},
    },
}

GIORNI_TIPO = {
    "Lunedì":   "LMV",
    "Martedì":  "MT",
    "Mercoledì":"LMV",
    "Giovedì":  "MT",
    "Venerdì":  "LMV",
    "Sabato":   "SAB",
    "Domenica": "DOM",
}
GIORNI = list(GIORNI_TIPO.keys())

SPUNTINO_MATTINA = "1 frutto a scelta (10:00)"
SHAKE = "1 scoop whey (30g) + 5g creatina  [16:00]"
GOUTER = "Olive / formaggio / hummus / oleaginosi (15g)  +  100g cottage cheese  +  crudités  [16:00]"

# Cene speciali weekend
CENA_SAB = {
    "nome": "Esempio cena pasta (sabato)",
    "entrée": "Crudités + vinaigrette (facoltativo se no verdure con pasta)",
    "componenti": [
        "Verdure crude/cotte (1/3 – ½ piatto)",
        "200g pasta di legumi cotta (= 100g cruda)",
        "25g formaggio  OPPURE  10g burro  OPPURE  25g pesto  OPPURE  25g crème entière",
        "1 CAS olio EVO (10g)",
    ],
    "macro": {"prot": 55, "kcal": 620},
}
CENA_DOM = {
    "nome": "Esempio cena beans based (domenica)",
    "componenti": [
        "Verdure crude/cotte (1/3 – ½ piatto)",
        "190g fagioli rossi/bianchi/neri cotti",
        "150g cereali/pasta cotti  OPPURE  200g patata dolce  OPPURE  180g lenticchie",
        "Grasso: olio EVO / avocado / oleaginosi (stessa lista pranzo)",
    ],
    "macro": {"prot": 50, "kcal": 600},
}

# ═══════════════════════════════════════════════════════
# GENERATORE PIANO SETTIMANALE
# ═══════════════════════════════════════════════════════

def genera_settimana():
    piano = {}
    proteine_usate = []  # ultime usate per evitare ripetizioni

    for giorno in GIORNI:
        tipo = GIORNI_TIPO[giorno]

        # Seleziona proteina pranzo (no ripetizione consecutiva)
        prot_pranzo = _scegli_proteina(proteine_usate[-1] if proteine_usate else None,
                                       proteine_usate[-2] if len(proteine_usate) >= 2 else None)

        # Seleziona proteina cena (diversa dal pranzo)
        prot_cena = _scegli_proteina(prot_pranzo, proteine_usate[-1] if proteine_usate else None)

        # Seleziona fecola (varia pranzo/cena)
        fec_pranzo = _scegli_fecola([])
        fec_cena = _scegli_fecola([fec_pranzo])

        # Seleziona grasso (se proteina grassa → preferire grassi leggeri)
        gras_pranzo = _scegli_grasso(PROTEINE[prot_pranzo]["tipo"])
        gras_cena = _scegli_grasso(PROTEINE[prot_cena]["tipo"], escludi=[gras_pranzo])

        proteine_usate.append(prot_pranzo)
        proteine_usate.append(prot_cena)

        # Cene speciali sabato e domenica
        cena_speciale = None
        if tipo == "SAB":
            cena_speciale = "SAB"
        elif tipo == "DOM":
            cena_speciale = "DOM"

        piano[giorno] = {
            "tipo": tipo,
            "colazione": COLAZIONI[tipo]["nome"],
            "spuntino": SPUNTINO_MATTINA,
            "pranzo": {
                "proteina": prot_pranzo,
                "fecola": fec_pranzo,
                "grasso": gras_pranzo,
                "macro": _calcola_macro(prot_pranzo, fec_pranzo, gras_pranzo),
            },
            "shake": SHAKE,
            "gouter": GOUTER,
            "cena": {
                "speciale": cena_speciale,
                "proteina": prot_cena if not cena_speciale else None,
                "fecola": fec_cena if not cena_speciale else None,
                "grasso": gras_cena if not cena_speciale else None,
                "macro": _calcola_macro(prot_cena, fec_cena, gras_cena) if not cena_speciale else CENA_SAB["macro"] if cena_speciale == "SAB" else CENA_DOM["macro"],
            },
        }

    return piano


def _scegli_proteina(escludi1=None, escludi2=None):
    opzioni = [p for p in PROTEINE if p != escludi1 and p != escludi2]
    return random.choice(opzioni)


def _scegli_fecola(escludi=None):
    escludi = escludi or []
    opzioni = [f for f in FECULENTI if f not in escludi]
    return random.choice(opzioni)


def _scegli_grasso(tipo_proteina, escludi=None):
    escludi = escludi or []
    opzioni = [g for g in GRASSI if g not in escludi]
    # Se proteina grassa, preferire grassi a basso contenuto calorico
    if tipo_proteina == "grassa":
        leggeri = [g for g in opzioni if GRASSI[g]["kcal"] <= 90]
        if leggeri:
            opzioni = leggeri
    return random.choice(opzioni)


def _calcola_macro(prot_id, fec_id, gras_id):
    p = PROTEINE.get(prot_id, {})
    f = FECULENTI.get(fec_id, {})
    g = GRASSI.get(gras_id, {})
    kcal = p.get("kcal", 0) + f.get("kcal", 0) + g.get("kcal", 0) + 50  # +50 verdure
    prot = p.get("prot", 0) + f.get("prot", 0) + g.get("prot", 0) + 3   # +3 verdure
    return {"kcal": kcal, "prot": prot}

# ═══════════════════════════════════════════════════════
# GENERAZIONE MENSILE
# ═══════════════════════════════════════════════════════

TIPO_GIORNO_MAP = {0: 'LMV', 1: 'MT', 2: 'LMV', 3: 'MT', 4: 'LMV', 5: 'SAB', 6: 'DOM'}
GIORNI_BREVI = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
NOME_MESI_IT = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']


def genera_mese(anno, mese):
    _, num_giorni = cal_module.monthrange(anno, mese)
    piano = {}
    proteine_usate = []

    for g in range(1, num_giorni + 1):
        d = date(anno, mese, g)
        tipo = TIPO_GIORNO_MAP[d.weekday()]

        prot_pranzo = _scegli_proteina(
            proteine_usate[-1] if proteine_usate else None,
            proteine_usate[-2] if len(proteine_usate) >= 2 else None,
        )
        prot_cena = _scegli_proteina(prot_pranzo, proteine_usate[-1] if proteine_usate else None)
        fec_pranzo = _scegli_fecola([])
        fec_cena   = _scegli_fecola([fec_pranzo])
        gras_pranzo = _scegli_grasso(PROTEINE[prot_pranzo]["tipo"])
        gras_cena   = _scegli_grasso(PROTEINE[prot_cena]["tipo"], escludi=[gras_pranzo])

        proteine_usate.append(prot_pranzo)
        proteine_usate.append(prot_cena)

        cena_speciale = "SAB" if tipo == "SAB" else ("DOM" if tipo == "DOM" else None)

        piano[d.isoformat()] = {
            "data": d.isoformat(),
            "giorno": g,
            "giorno_nome": GIORNI[d.weekday()],
            "giorno_breve": GIORNI_BREVI[d.weekday()],
            "tipo": tipo,
            "colazione": COLAZIONI[tipo]["nome"],
            "pranzo": {
                "proteina": prot_pranzo,
                "fecola": fec_pranzo,
                "grasso": gras_pranzo,
                "macro": _calcola_macro(prot_pranzo, fec_pranzo, gras_pranzo),
            },
            "cena": {
                "speciale": cena_speciale,
                "proteina": prot_cena if not cena_speciale else None,
                "fecola":   fec_cena  if not cena_speciale else None,
                "grasso":   gras_cena if not cena_speciale else None,
                "macro": (_calcola_macro(prot_cena, fec_cena, gras_cena) if not cena_speciale
                          else (CENA_SAB["macro"] if cena_speciale == "SAB" else CENA_DOM["macro"])),
            },
            "eccezione": False,
            "note_eccezione": "",
        }

    return piano


# ═══════════════════════════════════════════════════════
# LISTA DELLA SPESA
# ═══════════════════════════════════════════════════════

def calcola_spesa(piano):
    spesa = defaultdict(lambda: {"totale": 0, "u": "g", "cat": ""})

    for giorno, dati in piano.items():
        tipo = dati["tipo"]
        col = COLAZIONI[tipo]

        # Colazione
        for ingr, v in col["spesa"].items():
            spesa[ingr]["totale"] += v["q"]
            spesa[ingr]["u"] = v["u"]
            spesa[ingr]["cat"] = v["cat"]

        # Spuntino mattina: frutta
        spesa["Frutta fresca"]["totale"] += 150
        spesa["Frutta fresca"]["u"] = "g"
        spesa["Frutta fresca"]["cat"] = "Frutta"

        # Pranzo
        pr = dati["pranzo"]
        _aggiungi_componente(spesa, PROTEINE, pr["proteina"])
        _aggiungi_componente(spesa, FECULENTI, pr["fecola"])
        _aggiungi_componente(spesa, GRASSI, pr["grasso"])
        spesa["Verdure miste"]["totale"] += 300
        spesa["Verdure miste"]["u"] = "g"
        spesa["Verdure miste"]["cat"] = "Verdura fresca"

        # Shake (ogni giorno)
        spesa["Whey protein"]["totale"] += 30
        spesa["Whey protein"]["u"] = "g"
        spesa["Whey protein"]["cat"] = "Integratori"
        spesa["Creatina"]["totale"] += 5
        spesa["Creatina"]["u"] = "g"
        spesa["Creatina"]["cat"] = "Integratori"

        # Gouter (ogni giorno)
        spesa["Cottage cheese"]["totale"] += 100
        spesa["Cottage cheese"]["u"] = "g"
        spesa["Cottage cheese"]["cat"] = "Latticini"
        spesa["Oleaginosi"]["totale"] += 30
        spesa["Oleaginosi"]["u"] = "g"
        spesa["Oleaginosi"]["cat"] = "Semi e frutta secca"
        spesa["Crudités"]["totale"] += 150
        spesa["Crudités"]["u"] = "g"
        spesa["Crudités"]["cat"] = "Verdura fresca"

        # Cena
        ce = dati["cena"]
        if ce["speciale"] == "SAB":
            spesa["Pasta integrale / di legumi cotta"]["totale"] += 200
            spesa["Pasta integrale / di legumi cotta"]["u"] = "g"
            spesa["Pasta integrale / di legumi cotta"]["cat"] = "Pasta e cereali"
            spesa["Formaggio grattugiato"]["totale"] += 25
            spesa["Formaggio grattugiato"]["u"] = "g"
            spesa["Formaggio grattugiato"]["cat"] = "Latticini"
        elif ce["speciale"] == "DOM":
            spesa["Fagioli rossi/bianchi/neri cotti"]["totale"] += 190
            spesa["Fagioli rossi/bianchi/neri cotti"]["u"] = "g"
            spesa["Fagioli rossi/bianchi/neri cotti"]["cat"] = "Legumi"
            spesa["Patate / patata dolce cotte"]["totale"] += 150
            spesa["Patate / patata dolce cotte"]["u"] = "g"
            spesa["Patate / patata dolce cotte"]["cat"] = "Verdura e tuberi"
        else:
            if ce["proteina"]:
                _aggiungi_componente(spesa, PROTEINE, ce["proteina"])
            if ce["fecola"]:
                _aggiungi_componente(spesa, FECULENTI, ce["fecola"])
            if ce["grasso"]:
                _aggiungi_componente(spesa, GRASSI, ce["grasso"])

        spesa["Verdure miste"]["totale"] += 300
        spesa["Verdure miste"]["u"] = "g"
        spesa["Verdure miste"]["cat"] = "Verdura fresca"

    # Formatta quantità
    risultato = {}
    for ingr, v in spesa.items():
        tot = v["totale"]
        u = v["u"]
        if u == "g":
            if tot >= 1000:
                qta = f"{tot/1000:.1f} kg".replace(".0 ", " ")
            else:
                qta = f"{ceil(tot/50)*50} g"
        elif u == "ml":
            if tot >= 1000:
                qta = f"{tot/1000:.1f} L"
            else:
                qta = f"{ceil(tot/100)*100} ml"
        elif u == "pz":
            qta = f"{int(tot)} pz"
        else:
            qta = f"{tot} {u}"
        risultato[ingr] = {"qta": qta, "cat": v["cat"], "totale": round(tot), "u": u}

    return risultato


def calcola_spese_settimane(piano, anno, mese):
    """Raggruppa i giorni del piano per settimana ISO e calcola la spesa di ciascuna."""
    from collections import OrderedDict
    weeks = OrderedDict()
    for iso_str, d in sorted(piano.items()):
        dt = date.fromisoformat(iso_str)
        year_w, wnum, _ = dt.isocalendar()
        wkey = f"{year_w}-W{wnum:02d}"
        if wkey not in weeks:
            weeks[wkey] = {}
        weeks[wkey][iso_str] = d

    result = []
    for wkey, week_piano in weeks.items():
        spesa = calcola_spesa(week_piano)
        dates = sorted(week_piano.keys())
        dt_dal = date.fromisoformat(dates[0])
        dt_al  = date.fromisoformat(dates[-1])
        mesi_brevi = ['','Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
        label = f"{dt_dal.day} {mesi_brevi[dt_dal.month]} – {dt_al.day} {mesi_brevi[dt_al.month]}"
        result.append({"wkey": wkey, "label": label, "dal": dates[0], "al": dates[-1], "spesa": spesa})
    return result


def _aggiungi_componente(spesa, db, key):
    if key not in db:
        return
    v = db[key]
    spesa[key]["totale"] += v["q"]
    spesa[key]["u"] = v["u"]
    spesa[key]["cat"] = v["cat_spesa"]

# ═══════════════════════════════════════════════════════
# GENERATORE HTML
# ═══════════════════════════════════════════════════════

HTML = """<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Piano · Emanuele · {settimana}</title>
<style>
:root{{
  --bg:#f5f0e8;--paper:#fffdf8;--ink:#1a2820;--muted:#5a6b62;
  --green:#4f7a54;--green-light:#eef5ee;--green-soft:#d4e8d4;
  --amber:#d4820a;--amber-light:#fef9ee;--red:#c0392b;
  --blue:#1a6b9a;--blue-light:#e8f4fd;
  --line:#dde8da;--warm:#f2e3c4;
}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      background:var(--bg);color:var(--ink);font-size:14px;line-height:1.5}}
/* ALMANAC */
.almanac{{background:linear-gradient(135deg,#1a2820,#2d4a35);color:#fff;padding:10px 20px;text-align:center}}
.almanac-date{{font-size:11px;opacity:.7;letter-spacing:.1em;text-transform:uppercase}}
.almanac-quote{{font-style:italic;font-size:13px;margin-top:3px;opacity:.9;max-width:620px;margin-inline:auto}}
/* MOBILE TABS */
.day-tabs{{display:none;position:sticky;top:0;z-index:200;background:var(--paper);
           border-bottom:2px solid var(--line);box-shadow:0 2px 8px rgba(0,0,0,.08)}}
.day-tabs-row{{display:flex;overflow-x:auto;scrollbar-width:none}}
.day-tabs-row::-webkit-scrollbar{{display:none}}
.day-tab{{flex:0 0 auto;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;
          color:var(--muted);border-bottom:3px solid transparent;white-space:nowrap;transition:all .15s}}
.day-tab.active{{color:var(--green);border-bottom-color:var(--green);background:var(--green-light)}}
/* PAGE */
.page{{max-width:1500px;margin:0 auto;padding:12px}}
/* HEADER */
header{{background:linear-gradient(135deg,#fffdf8,#eef5ee);border:1px solid var(--line);
        border-radius:16px;padding:16px 20px;margin-bottom:10px;box-shadow:0 4px 16px rgba(26,40,32,.06)}}
.header-row{{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px}}
.patient-info h1{{font-size:clamp(16px,2.5vw,24px);color:var(--ink)}}
.patient-info p{{color:var(--muted);font-size:12px;margin-top:2px}}
.targets{{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}}
.target-pill{{background:var(--green-soft);border:1px solid var(--green);color:var(--green);
              padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600}}
.header-controls{{display:flex;gap:6px;align-items:center;flex-wrap:wrap}}
.btn{{padding:7px 12px;border-radius:9px;border:1px solid var(--line);background:var(--paper);
      color:var(--green);cursor:pointer;font-size:12px;font-family:inherit;transition:all .15s;font-weight:500}}
.btn:hover{{background:var(--green);color:#fff}}
.btn.primary{{background:var(--green);color:#fff;border-color:var(--green)}}
.btn.primary:hover{{background:#3a5c3e}}
.btn.amber{{background:var(--amber);color:#fff;border-color:var(--amber)}}
.btn.amber:hover{{background:#b06d00}}
#sync-status{{font-size:11px;color:var(--muted);margin-top:4px;text-align:right}}
/* WEEK BAR */
.week-bar{{display:flex;align-items:center;gap:8px;margin-bottom:10px;background:var(--paper);
           border:1px solid var(--line);border-radius:12px;padding:8px 14px;flex-wrap:wrap}}
.week-label{{flex:1;font-size:13px;font-weight:600;color:var(--ink);min-width:0}}
.variant-badge{{font-size:11px;color:var(--muted)}}
/* LAYOUT */
.layout{{display:grid;grid-template-columns:1fr 290px;gap:12px;align-items:start}}
@media(max-width:1000px){{.layout{{grid-template-columns:1fr}}}}
/* GIORNI GRID */
.giorni-grid{{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}}
@media(max-width:1100px){{.giorni-grid{{grid-template-columns:repeat(4,1fr)}}}}
@media(max-width:700px){{
  .day-tabs{{display:flex}}
  .giorni-grid{{grid-template-columns:1fr!important}}
  .giorno-card{{display:none}}
  .giorno-card.mobile-active{{display:block}}
  body{{padding-bottom:68px}}
}}
/* GIORNO CARD */
.giorno-card{{background:var(--paper);border:1px solid var(--line);border-radius:12px;
              overflow:hidden;box-shadow:0 2px 8px rgba(26,40,32,.05)}}
.giorno-card.oggi-card{{border-color:var(--green);box-shadow:0 0 0 2px var(--green-soft)}}
.giorno-header{{padding:8px 12px;background:linear-gradient(135deg,#f8f5ed,#f0ebe0);
                border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}}
.giorno-nome{{font-weight:700;font-size:14px;color:var(--green)}}
.giorno-tipo{{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}}
.oggi-badge{{font-size:10px;background:var(--green);color:#fff;padding:1px 6px;border-radius:999px}}
/* PASTO BLOCKS */
.pasto-block{{padding:9px 12px;border-bottom:1px solid var(--line)}}
.pasto-block:last-child{{border-bottom:none}}
.pasto-label{{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
              color:var(--muted);margin-bottom:5px;display:flex;align-items:center;gap:4px}}
.pasto-orario{{font-size:10px;color:var(--muted);margin-left:auto}}
/* COMPONENTI */
.comp{{display:flex;align-items:flex-start;gap:5px;padding:4px 6px;border-radius:7px;
       cursor:pointer;transition:background .12s;border:1px solid transparent;margin-bottom:2px}}
.comp:hover{{background:var(--green-light);border-color:var(--green-soft)}}
.comp-icon{{font-size:13px;flex-shrink:0;margin-top:1px}}
.comp-body{{flex:1;min-width:0}}
.comp-nome{{font-size:12px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.comp-detail{{font-size:10px;color:var(--muted)}}
.comp-tipo{{font-size:9px;padding:1px 5px;border-radius:999px;margin-left:3px;font-weight:600}}
.t-magra{{background:#d4edd4;color:#1a6b1a}}
.t-grassa{{background:#fde8c8;color:#8b4500}}
/* MACRO BADGE */
.macro-badge{{display:inline-flex;align-items:center;gap:5px;font-size:10px;
              margin-top:4px;padding:2px 7px;border-radius:5px}}
.macro-ok{{background:#d4edd4;color:#1a5c1a}}
.macro-warn{{background:#fde8c8;color:#8b4500}}
.macro-low{{background:#fde4e4;color:#8b0000}}
/* PASTI FISSI */
.pasto-fisso{{padding:9px 12px;border-bottom:1px solid var(--line);background:var(--amber-light)}}
.pasto-fisso:last-child{{border-bottom:none}}
.pasto-fisso-text{{font-size:11px;color:var(--amber);font-weight:500}}
.pasto-col{{background:var(--blue-light)}}
.pasto-col .pasto-label{{color:var(--blue)}}
.pasto-col-item{{font-size:11px;color:var(--ink);padding:2px 0;border-bottom:1px dashed var(--line)}}
.pasto-col-item:last-child{{border:none}}
/* SIDEBAR */
.sidebar{{display:flex;flex-direction:column;gap:10px;position:sticky;top:16px}}
.card{{background:var(--paper);border:1px solid var(--line);border-radius:12px;
       padding:14px;box-shadow:0 2px 8px rgba(26,40,32,.05)}}
.card h3{{font-size:14px;color:var(--green);margin-bottom:10px;display:flex;align-items:center;gap:6px}}
.card h3::before{{content:"";width:18px;height:2px;background:var(--green)}}
.macro-riga{{display:flex;justify-content:space-between;align-items:center;
             padding:4px 0;border-bottom:1px solid var(--line);font-size:12px}}
.macro-riga:last-child{{border:none}}
.macro-val{{font-weight:700;color:var(--green)}}
.progress-bar{{height:5px;border-radius:3px;background:var(--line);margin-top:2px;overflow:hidden}}
.progress-fill{{height:100%;border-radius:3px;background:var(--green);transition:width .3s}}
/* SPESA */
.spesa-gruppo{{margin-bottom:10px}}
.spesa-gruppo h4{{font-size:11px;font-weight:700;color:var(--green);margin-bottom:4px;
                  padding-bottom:2px;border-bottom:1px solid var(--line)}}
.spesa-item{{display:flex;align-items:center;gap:5px;padding:2px 0;font-size:11px}}
.spesa-item label{{flex:1;cursor:pointer}}
.spesa-item span{{color:var(--muted);white-space:nowrap;font-size:10px}}
.spesa-item.checked label{{text-decoration:line-through;opacity:.45}}
.spesa-check{{accent-color:var(--green);cursor:pointer}}
/* DIALOGS */
dialog{{border:none;border-radius:16px;padding:0;max-width:480px;width:95%;
        box-shadow:0 20px 60px rgba(0,0,0,.2)}}
dialog::backdrop{{background:rgba(26,40,32,.4);backdrop-filter:blur(3px)}}
.modal-hdr{{padding:16px 18px 12px;border-bottom:1px solid var(--line)}}
.modal-hdr h2{{font-size:17px;color:var(--ink)}}
.modal-hdr p{{font-size:11px;color:var(--muted);margin-top:2px}}
.modal-body{{padding:12px 18px;max-height:60vh;overflow-y:auto}}
.modal-ftr{{padding:10px 18px 14px;display:flex;gap:8px;justify-content:flex-end;border-top:1px solid var(--line)}}
.opt-card{{border:1px solid var(--line);border-radius:10px;padding:10px;cursor:pointer;
           transition:all .12s;margin-bottom:6px;background:var(--bg)}}
.opt-card:hover{{border-color:var(--green);background:var(--green-light)}}
.opt-card strong{{font-size:12px;color:var(--ink)}}
.opt-card .opt-q{{font-size:10px;color:var(--muted);margin-top:1px}}
.opt-card .opt-macro{{font-size:10px;color:var(--green);font-weight:600;margin-top:3px}}
.opt-card .opt-note{{font-size:10px;color:var(--amber);margin-top:2px}}
/* EMAIL MODAL */
.email-form label{{display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:var(--ink)}}
.email-input{{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;
              font-size:13px;font-family:inherit;outline:none}}
.email-input:focus{{border-color:var(--green);box-shadow:0 0 0 2px var(--green-soft)}}
.email-default-row{{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;color:var(--muted)}}
/* MOBILE BOTTOM BAR */
.mobile-bar{{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--paper);
             border-top:1px solid var(--line);padding:8px 12px;gap:6px;z-index:300;
             box-shadow:0 -4px 16px rgba(0,0,0,.08)}}
@media(max-width:700px){{
  .mobile-bar{{display:flex}}
  .mobile-bar .btn{{flex:1;text-align:center;font-size:11px;padding:8px 4px}}
}}
/* RACCOMANDAZIONI */
.rec-item{{font-size:11px;padding:4px 0;border-bottom:1px solid var(--line);color:var(--muted)}}
.rec-item:last-child{{border:none}}
.rec-item strong{{color:var(--green)}}
@media print{{
  .sidebar,.btn,.header-controls,dialog,.mobile-bar,.day-tabs,.almanac,.week-bar{{display:none!important}}
  .layout{{grid-template-columns:1fr}}
  .giorni-grid{{grid-template-columns:repeat(4,1fr)!important}}
  .giorno-card{{display:block!important}}
}}
</style>
</head>
<body>

<div class="almanac" id="almanac-bar">
  <div class="almanac-date" id="almanac-date"></div>
  <div class="almanac-quote" id="almanac-quote"></div>
</div>

<nav class="day-tabs">
  <div class="day-tabs-row" id="day-tabs-row"></div>
</nav>

<div class="page">
<header>
  <div class="header-row">
    <div class="patient-info">
      <h1>Piano Alimentare · {nome_paziente}</h1>
      <p>Applicazione sviluppata da Serafino Resout</p>
      <div class="targets">
        <span class="target-pill">🎯 178g prot/giorno</span>
        <span class="target-pill">⚡ 620 kcal per pasto</span>
        <span class="target-pill">💪 53g prot per pasto</span>
        <span class="target-pill">💧 1.5–2L acqua</span>
      </div>
    </div>
    <div class="header-controls">
      <button class="btn" onclick="salvaSuSheets()">☁️ Sheets</button>
      <button class="btn" onclick="caricaDaSheets()">🔄 Carica</button>
      <button class="btn amber" onclick="apriModalEmail()">✉️ Invia spesa</button>
      <button class="btn primary" onclick="window.print()">🖨 Stampa</button>
    </div>
  </div>
  <div id="sync-status"></div>
</header>

<div class="week-bar">
  <span class="week-label" id="week-label">{settimana}</span>
  <span class="variant-badge" id="variant-badge">Variante 1/3</span>
  <button class="btn" onclick="rigeneraVariante()">🎲 Variante</button>
  <button class="btn" onclick="cambiaSett()" id="btn-sett">📅 Sett. successiva →</button>
</div>

<div class="layout">
  <section>
    <div class="giorni-grid" id="giorni-grid"></div>
  </section>
  <aside class="sidebar">
    <div class="card">
      <h3>Macros settimana</h3>
      <div id="macro-riepilogo"></div>
    </div>
    <div class="card">
      <h3>Regole chiave</h3>
      <div class="rec-item"><strong>Verdure</strong> ≥ 1/3 del piatto a pranzo e cena</div>
      <div class="rec-item"><strong>Proteine</strong> 2g/kg = 178g/giorno dalla colazione</div>
      <div class="rec-item"><strong>Grasso cottura</strong> max 1 cac olio (LMV colazione)</div>
      <div class="rec-item"><strong>Shake 16:00</strong> whey 30g + creatina 5g ogni giorno</div>
      <div class="rec-item"><strong>Acqua</strong> 1.5–2 litri tra i pasti</div>
      <div class="rec-item"><strong>Vinaigrette</strong> 40g skyr+aceto sidro+balsamico+senape</div>
      <div class="rec-item"><strong>Salmone sockeye</strong> preferire per omega-3 qualità</div>
    </div>
    <div class="card">
      <h3>Lista della Spesa</h3>
      <div id="spesa-container"></div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button class="btn" style="flex:1" onclick="stampaSpesa()">🖨 Stampa</button>
        <button class="btn amber" style="flex:1" onclick="apriModalEmail()">✉️ Invia</button>
      </div>
    </div>
  </aside>
</div>
</div>

<div class="mobile-bar">
  <button class="btn" onclick="rigeneraVariante()">🎲 Variante</button>
  <button class="btn" onclick="cambiaSett()">📅 Sett. +</button>
  <button class="btn amber" onclick="apriModalEmail()">✉️ Spesa</button>
</div>

<dialog id="modal">
  <div class="modal-hdr">
    <h2 id="modal-titolo">Scegli alternativa</h2>
    <p id="modal-sotto">Seleziona un'opzione</p>
  </div>
  <div class="modal-body" id="modal-body"></div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal').close()">Annulla</button>
  </div>
</dialog>

<dialog id="modal-email">
  <div class="modal-hdr">
    <h2>✉️ Invia Lista Spesa</h2>
    <p>Riceverai la lista della spesa via email</p>
  </div>
  <div class="modal-body">
    <div class="email-form">
      <label for="email-input">Indirizzo email destinatario</label>
      <input class="email-input" type="email" id="email-input"
             placeholder="nome@esempio.it" oninput="aggiornaEmailUI()">
      <div class="email-default-row">
        <input type="checkbox" id="email-default-cb" onchange="toggleDefaultEmail()">
        <label for="email-default-cb">Salva come email predefinita</label>
      </div>
    </div>
  </div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal-email').close()">Annulla</button>
    <button class="btn amber" id="btn-invia-email" onclick="inviaEmail()" disabled>✉️ Invia</button>
  </div>
</dialog>

<script>
// ── DATI EMBEDDED ─────────────────────────────────────────────────────────────
const TUTTE_VARIANTI  = {varianti_json};
const SETTIMANE       = {settimane_json};
const TUTTE_SPESE     = {spese_json};
const PROTEINE_DB     = {proteine_json};
const FECULENTI_DB    = {feculenti_json};
const GRASSI_DB       = {grassi_json};
const COLAZIONI_DB    = {colazioni_json};
const GIORNI          = {giorni_json};
const GIORNI_TIPO     = {giorni_tipo_json};
const CENA_SAB        = {cena_sab_json};
const CENA_DOM        = {cena_dom_json};
const TARGET          = {{kcal:620, prot:53}};
const APPS_SCRIPT_URL = "{apps_script_url}";
const DATA_OGGI       = new Date("{data_oggi_iso}");

let settimanaIdx = 0;
let varianteIdx  = 0;
let giornoActiveMobile = DATA_OGGI.getDay() === 0 ? 6 : DATA_OGGI.getDay() - 1;
let modalCtx = null;
let pianoCorrente = null;
let spesaCorrente = null;

// ── FRASI ALMANACCO ───────────────────────────────────────────────────────────
const FRASI = [
  "Il corpo realizza ciò che la mente crede.",
  "Ogni pasto è un'opportunità per nutrire la tua energia.",
  "La disciplina è il ponte tra gli obiettivi e i risultati.",
  "Non si tratta di perfezione, ma di progresso costante.",
  "Mangia bene, muoviti bene, vivi bene.",
  "Il cambiamento inizia con una scelta — anche quella di oggi.",
  "Il tuo corpo è un tempio: trattalo di conseguenza.",
  "La forza non viene dalla capacità fisica, ma dalla volontà indomita.",
  "Investire nella propria salute è il miglior investimento che esista.",
  "Ogni mattina è una nuova opportunità per fare la scelta giusta.",
  "L'alimentazione è la base su cui si costruisce tutto il resto.",
  "La costanza batte il talento quando il talento non è costante.",
  "Non aspettare la motivazione — agisci e la motivazione arriverà.",
  "Piccoli passi ogni giorno portano a grandi trasformazioni.",
  "Il tuo futuro io ti ringrazierà per le scelte di oggi.",
  "La salute è una pratica quotidiana, non una destinazione.",
  "Nutrìti come se il tuo corpo fosse la cosa più preziosa che possiedi.",
  "La pazienza è il segreto di ogni trasformazione duratura.",
  "Ogni grammo di proteina è un mattone per la tua forza.",
  "Il benessere non è un lusso, è una necessità.",
  "La coerenza supera sempre la perfezione.",
  "Ascolta il tuo corpo: sa più di quanto pensi.",
  "Un buon pasto è un atto d'amore verso sé stessi.",
  "La fatica di oggi è la forza di domani.",
  "Scegliere bene a tavola è scegliere bene per la vita.",
  "Il corpo che vuoi è costruito con le abitudini di ogni giorno.",
  "Non esiste scorciatoia per una salute duratura.",
  "Ogni variante è una nuova scoperta gustosa.",
  "Il successo nel benessere si misura in settimane e mesi.",
  "Idratarsi è il gesto più semplice e più potente per la salute.",
];
const MESI_IT  = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
                  "luglio","agosto","settembre","ottobre","novembre","dicembre"];
const GIORNI_IT = ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"];

function getWeekNumber(d) {{
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}}

function initAlmanacco() {{
  const d = DATA_OGGI;
  const wk = getWeekNumber(d);
  const dayStr = GIORNI_IT[d.getDay()];
  document.getElementById('almanac-date').textContent =
    dayStr.charAt(0).toUpperCase()+dayStr.slice(1)+', '+d.getDate()+' '+MESI_IT[d.getMonth()]+' '+d.getFullYear()+' · Settimana '+wk;
  document.getElementById('almanac-quote').textContent =
    '"' + FRASI[(d.getDate() + d.getMonth()*31 + wk) % FRASI.length] + '"';
}}

// ── TABS MOBILE ───────────────────────────────────────────────────────────────
function renderTabs() {{
  const oggi = DATA_OGGI.getDay() === 0 ? 6 : DATA_OGGI.getDay() - 1;
  const sigle = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
  document.getElementById('day-tabs-row').innerHTML = GIORNI.map((g,i) =>
    `<div class="day-tab${{(settimanaIdx===0 && i===oggi)?' oggi':''}}${{i===giornoActiveMobile?' active':''}}"
          onclick="setGiorno(${{i}})">${{sigle[i]}}</div>`
  ).join('');
}}

function setGiorno(idx) {{
  giornoActiveMobile = idx;
  document.querySelectorAll('.day-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.giorno-card').forEach((c,i) => c.classList.toggle('mobile-active', i===idx));
}}

// ── RENDER ────────────────────────────────────────────────────────────────────
function render() {{
  pianoCorrente = JSON.parse(JSON.stringify(TUTTE_VARIANTI[settimanaIdx][varianteIdx]));
  spesaCorrente = JSON.parse(JSON.stringify(TUTTE_SPESE[settimanaIdx][varianteIdx]));
  renderGiorni();
  renderTabs();
  renderMacroRiepilogo();
  renderSpesa();
  document.getElementById('week-label').textContent = SETTIMANE[settimanaIdx];
  document.getElementById('variant-badge').textContent =
    'Variante '+(varianteIdx+1)+'/'+TUTTE_VARIANTI[settimanaIdx].length;
  document.getElementById('btn-sett').textContent =
    settimanaIdx === 0 ? '📅 Sett. successiva →' : '← Sett. corrente';
}}

function renderGiorni() {{
  const oggi = DATA_OGGI.getDay() === 0 ? 6 : DATA_OGGI.getDay() - 1;
  document.getElementById('giorni-grid').innerHTML =
    GIORNI.map((g,i) => renderGiorno(g, i, oggi)).join('');
  document.querySelectorAll('.giorno-card').forEach((c,i) =>
    c.classList.toggle('mobile-active', i===giornoActiveMobile));
}}

function renderGiorno(giorno, idx, oggiIdx) {{
  const d = pianoCorrente[giorno];
  const col = COLAZIONI_DB[d.tipo];
  const tipoLabel = {{LMV:'Lun/Mer/Ven',MT:'Mar/Gio',SAB:'Sabato',DOM:'Domenica'}}[d.tipo]||d.tipo;
  const isOggi = idx===oggiIdx && settimanaIdx===0;
  return `<div class="giorno-card${{isOggi?' oggi-card':''}}">
    <div class="giorno-header">
      <span class="giorno-nome">${{giorno}}</span>
      <span class="giorno-tipo">${{tipoLabel}}</span>
      ${{isOggi?'<span class="oggi-badge">Oggi</span>':''}}
    </div>
    <div class="pasto-block pasto-col">
      <div class="pasto-label">☀️ Colazione <span class="pasto-orario">07:00</span></div>
      ${{col.componenti.map(c=>`<div class="pasto-col-item">${{c}}</div>`).join('')}}
      ${{col.nota?`<div style="font-size:10px;color:var(--amber);margin-top:3px">💡 ${{col.nota}}</div>`:''}}
    </div>
    <div class="pasto-fisso">
      <div class="pasto-label">🍎 Spuntino <span class="pasto-orario">10:00</span></div>
      <div class="pasto-fisso-text">1 frutto a scelta</div>
    </div>
    <div class="pasto-block">
      <div class="pasto-label">🥗 Pranzo <span class="pasto-orario">12:00</span></div>
      ${{renderComp(giorno,'pranzo','proteina','🥩',d.pranzo.proteina,PROTEINE_DB)}}
      ${{renderComp(giorno,'pranzo','fecola','🌾',d.pranzo.fecola,FECULENTI_DB)}}
      ${{renderComp(giorno,'pranzo','grasso','🥑',d.pranzo.grasso,GRASSI_DB)}}
      <div class="comp" style="cursor:default"><span class="comp-icon">🥦</span>
        <div class="comp-body"><div class="comp-nome">Verdure crude/cotte</div>
          <div class="comp-detail">≥ 1/3 – ½ piatto · libero</div></div></div>
      ${{renderMacroBadge(d.pranzo.macro)}}
    </div>
    <div class="pasto-fisso">
      <div class="pasto-label">💊 Shake <span class="pasto-orario">16:00</span></div>
      <div class="pasto-fisso-text">Whey 30g + Creatina 5g</div>
    </div>
    <div class="pasto-fisso">
      <div class="pasto-label">🫒 Goûter <span class="pasto-orario">16:00</span></div>
      <div class="pasto-fisso-text">Olive/formaggio/hummus + 100g cottage cheese + crudités</div>
    </div>
    <div class="pasto-block">
      <div class="pasto-label">🌙 Cena <span class="pasto-orario">19:00</span></div>
      ${{renderCena(giorno, d.cena)}}
    </div>
  </div>`;
}}

function renderComp(giorno, pasto, campo, icon, nome, db) {{
  const v = db[nome]||{{}};
  const tipoTag = v.tipo?`<span class="comp-tipo t-${{v.tipo}}">${{v.tipo}}</span>`:'';
  const detail = [v.q_str||'',v.prot?v.prot+'g prot':'',v.kcal?v.kcal+' kcal':''].filter(Boolean).join(' · ');
  const safeNome = nome.replace(/'/g,"\\'");
  return `<div class="comp" onclick="apriModal('${{giorno}}','${{pasto}}','${{campo}}')">
    <span class="comp-icon">${{icon}}</span>
    <div class="comp-body">
      <div class="comp-nome">${{nome}}${{tipoTag}}</div>
      <div class="comp-detail">${{detail}}</div>
    </div>
  </div>`;
}}

function renderCena(giorno, cena) {{
  if(cena.speciale==='SAB') return `
    <div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:5px">🍝 ${{CENA_SAB.nome}}</div>
    ${{CENA_SAB.componenti.map(c=>`<div style="font-size:11px;color:var(--muted);padding:1px 0">${{c}}</div>`).join('')}}
    ${{renderMacroBadge(CENA_SAB.macro)}}`;
  if(cena.speciale==='DOM') return `
    <div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:5px">🫘 ${{CENA_DOM.nome}}</div>
    ${{CENA_DOM.componenti.map(c=>`<div style="font-size:11px;color:var(--muted);padding:1px 0">${{c}}</div>`).join('')}}
    ${{renderMacroBadge(CENA_DOM.macro)}}`;
  return `
    ${{renderComp(giorno,'cena','proteina','🥩',cena.proteina,PROTEINE_DB)}}
    ${{renderComp(giorno,'cena','fecola','🌾',cena.fecola,FECULENTI_DB)}}
    ${{renderComp(giorno,'cena','grasso','🥑',cena.grasso,GRASSI_DB)}}
    <div class="comp" style="cursor:default"><span class="comp-icon">🥦</span>
      <div class="comp-body"><div class="comp-nome">Verdure crude/cotte</div>
        <div class="comp-detail">≥ 1/3 – ½ piatto · libero</div></div></div>
    ${{renderMacroBadge(cena.macro)}}`;
}}

function renderMacroBadge(macro) {{
  if(!macro) return '';
  const ok=macro.prot>=TARGET.prot*.9, med=macro.prot>=TARGET.prot*.75;
  const cls=ok?'macro-ok':med?'macro-warn':'macro-low';
  return `<div class="macro-badge ${{cls}}">⚡ ${{macro.kcal}} kcal · 💪 ${{macro.prot}}g prot ${{ok?'✅':'⚠️'}}</div>`;
}}

// ── RIEPILOGO MACRO ───────────────────────────────────────────────────────────
function renderMacroRiepilogo() {{
  let totProt=0, totKcal=0;
  GIORNI.forEach(g => {{
    const d=pianoCorrente[g], col=COLAZIONI_DB[d.tipo];
    totProt +=(col.macro?.prot||0)+(d.pranzo.macro?.prot||0)+(d.cena.macro?.prot||0);
    totKcal +=(col.macro?.kcal||0)+(d.pranzo.macro?.kcal||0)+(d.cena.macro?.kcal||0);
  }});
  const avgProt=Math.round(totProt/7), avgKcal=Math.round(totKcal/7);
  const pct=Math.min(100,Math.round(avgProt/178*100));
  document.getElementById('macro-riepilogo').innerHTML = `
    <div class="macro-riga"><span>Media prot/giorno</span><span class="macro-val">${{avgProt}}g</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${{pct}}%"></div></div>
    <div style="font-size:10px;color:var(--muted);margin:2px 0 6px">Target: 178g (${{pct}}%)</div>
    <div class="macro-riga"><span>Media kcal/giorno</span><span class="macro-val">${{avgKcal}}</span></div>
    <div class="macro-riga"><span>Target per pasto</span><span class="macro-val">53g · 620kcal</span></div>`;
}}

// ── VARIANTI & SETTIMANE ──────────────────────────────────────────────────────
function rigeneraVariante() {{
  const nVar = TUTTE_VARIANTI[settimanaIdx].length;
  varianteIdx = (varianteIdx+1) % nVar;
  render();
  setSyncStatus('🎲 Variante '+(varianteIdx+1)+'/'+nVar);
}}

function cambiaSett() {{
  settimanaIdx = 1 - settimanaIdx;
  varianteIdx = 0;
  giornoActiveMobile = settimanaIdx===0 ? (DATA_OGGI.getDay()===0?6:DATA_OGGI.getDay()-1) : 0;
  render();
}}

// ── MODAL COMPONENTE ──────────────────────────────────────────────────────────
function apriModal(giorno, pasto, campo) {{
  modalCtx = {{giorno, pasto, campo}};
  const db = campo==='proteina'?PROTEINE_DB:campo==='fecola'?FECULENTI_DB:GRASSI_DB;
  const corrente = pianoCorrente[giorno][pasto][campo];
  const titoli = {{proteina:'🥩 Cambia proteina',fecola:'🌾 Cambia fecola',grasso:'🥑 Cambia grasso'}};
  document.getElementById('modal-titolo').textContent = titoli[campo];
  document.getElementById('modal-sotto').textContent = `Attuale: ${{corrente}} · ${{giorno}} ${{pasto}}`;
  document.getElementById('modal-body').innerHTML = Object.entries(db).map(([nome,v]) => {{
    const sel=nome===corrente;
    const tipoTag=v.tipo?`<span class="comp-tipo t-${{v.tipo}}" style="margin-left:3px">${{v.tipo}}</span>`:'';
    const safeNome=nome.replace(/'/g,"\\'");
    return `<div class="opt-card" onclick="scegliComponente('${{safeNome}}')"
      style="${{sel?'border-color:var(--green);background:var(--green-light)':''}}">
      <strong>${{nome}}</strong>${{tipoTag}}
      <div class="opt-q">${{v.q_str||''}} ${{sel?'· ✅ Attuale':''}}</div>
      <div class="opt-macro">${{v.prot?v.prot+'g prot · ':''}}${{v.kcal}} kcal</div>
      ${{v.note?`<div class="opt-note">💡 ${{v.note}}</div>`:''}}
    </div>`;
  }}).join('');
  document.getElementById('modal').showModal();
}}

function scegliComponente(nome) {{
  if(!modalCtx) return;
  const {{giorno, pasto, campo}} = modalCtx;
  pianoCorrente[giorno][pasto][campo] = nome;
  const p = pianoCorrente[giorno][pasto];
  if(p.proteina && p.fecola && p.grasso) {{
    const pDB=PROTEINE_DB[p.proteina]||{{}}, fDB=FECULENTI_DB[p.fecola]||{{}}, gDB=GRASSI_DB[p.grasso]||{{}};
    p.macro = {{kcal:(pDB.kcal||0)+(fDB.kcal||0)+(gDB.kcal||0)+50,
                prot:(pDB.prot||0)+(fDB.prot||0)+(gDB.prot||0)+3}};
  }}
  document.getElementById('modal').close();
  render();
  if(APPS_SCRIPT_URL)
    sheetsPost({{action:'updateComponente',giorno,pasto,tipo_comp:campo,nuovo_valore:nome}})
      .then(r => {{ if(r.success) setSyncStatus('✅ Sheets · '+now()); }});
}}

// ── EMAIL ─────────────────────────────────────────────────────────────────────
function apriModalEmail() {{
  const saved = localStorage.getItem('email_spesa_default')||'';
  document.getElementById('email-input').value = saved;
  document.getElementById('email-default-cb').checked = !!saved;
  document.getElementById('btn-invia-email').disabled = !saved||!saved.includes('@');
  document.getElementById('modal-email').showModal();
}}

function aggiornaEmailUI() {{
  const v = document.getElementById('email-input').value.trim();
  document.getElementById('btn-invia-email').disabled = !v||!v.includes('@');
}}

function toggleDefaultEmail() {{
  const cb=document.getElementById('email-default-cb');
  const v=document.getElementById('email-input').value.trim();
  if(cb.checked && v) localStorage.setItem('email_spesa_default',v);
  else if(!cb.checked) localStorage.removeItem('email_spesa_default');
}}

async function inviaEmail() {{
  const email = document.getElementById('email-input').value.trim();
  if(!email) return;
  if(document.getElementById('email-default-cb').checked)
    localStorage.setItem('email_spesa_default', email);
  const gruppi = {{}};
  for(const [ingr,v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat]=[];
    gruppi[v.cat].push(ingr+': '+v.qta);
  }}
  const corpo = 'Lista della Spesa - Emanuele - '+SETTIMANE[settimanaIdx]+' - Variante '+(varianteIdx+1)+'\\n\\n'+
    Object.entries(gruppi).sort().map(([cat,items]) =>
      cat.toUpperCase()+'\\n'+items.map(i=>'  \u2022 '+i).join('\\n')).join('\\n\\n');
  const btn=document.getElementById('btn-invia-email');
  btn.textContent='⏳...'; btn.disabled=true;
  let sent=false;
  if(APPS_SCRIPT_URL) {{
    const r=await sheetsPost({{action:'inviaMailSpesa',email,corpo,settimana:SETTIMANE[settimanaIdx]}});
    if(r.success) {{ sent=true; setSyncStatus('✉️ Email inviata a '+email); }}
  }}
  if(!sent) {{
    const sub=encodeURIComponent('Lista Spesa Emanuele - '+SETTIMANE[settimanaIdx]);
    window.open('mailto:'+email+'?subject='+sub+'&body='+encodeURIComponent(corpo));
    setSyncStatus('✉️ Aperto client mail');
  }}
  document.getElementById('modal-email').close();
  btn.textContent='✉️ Invia'; btn.disabled=false;
}}

// ── SPESA ─────────────────────────────────────────────────────────────────────
function renderSpesa() {{
  const gruppi = {{}};
  for(const [ingr,v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat]=[];
    gruppi[v.cat].push({{nome:ingr,qta:v.qta}});
  }}
  document.getElementById('spesa-container').innerHTML =
    Object.entries(gruppi).sort().map(([cat,items]) => `
      <div class="spesa-gruppo"><h4>${{cat}}</h4>
        ${{items.map((it,i)=>`
          <div class="spesa-item" id="si_${{cat.replace(/[^a-z0-9]/gi,'_')}}_${{i}}">
            <input class="spesa-check" type="checkbox"
              onchange="this.closest('.spesa-item').classList.toggle('checked',this.checked)">
            <label>${{it.nome}}</label><span>${{it.qta}}</span>
          </div>`).join('')}}
      </div>`).join('');
}}

function stampaSpesa() {{
  const gruppi = {{}};
  for(const [ingr,v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat]=[];
    gruppi[v.cat].push(`<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:13px"><span>${{ingr}}</span><span style="color:#666">${{v.qta}}</span></div>`);
  }}
  const w=window.open('','_blank');
  w.document.write(`<html><head><title>Lista Spesa Emanuele</title>
    <style>body{{font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto}}
    h1{{color:#4f7a54;font-size:18px}}h3{{color:#4f7a54;margin:14px 0 4px;border-bottom:1px solid #ddd;padding-bottom:2px;font-size:13px}}
    p{{font-size:11px;color:#888;margin-bottom:12px}}</style></head><body>
    <h1>Lista Spesa · Emanuele</h1>
    <p>Settimana ${{SETTIMANE[settimanaIdx]}} · Variante ${{varianteIdx+1}}</p>
    ${{Object.entries(gruppi).sort().map(([cat,rows])=>`<h3>${{cat}}</h3>${{rows.join('')}}`).join('')}}
  </body></html>`);
  w.print();
}}

// ── GOOGLE SHEETS ─────────────────────────────────────────────────────────────
function setSyncStatus(msg) {{
  const el=document.getElementById('sync-status');
  if(el) el.textContent=msg;
}}
function now() {{ return new Date().toLocaleTimeString('it-IT',{{hour:'2-digit',minute:'2-digit'}}); }}

async function sheetsPost(payload) {{
  try {{
    const r=await fetch(APPS_SCRIPT_URL,{{
      method:'POST', redirect:'follow',
      body:JSON.stringify(payload),
      headers:{{'Content-Type':'text/plain'}},  // evita preflight CORS
    }});
    return await r.json();
  }} catch(e) {{ setSyncStatus('❌ '+e.message); return {{error:e.message}}; }}
}}

async function sheetsGet(params) {{
  const url=new URL(APPS_SCRIPT_URL);
  Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
  try {{ const r=await fetch(url.toString(),{{redirect:'follow'}}); return await r.json(); }}
  catch(e) {{ return {{error:e.message}}; }}
}}

async function salvaSuSheets() {{
  setSyncStatus('⏳ Salvataggio...');
  const pianoFlat={{}};
  GIORNI.forEach(g => {{
    const d=pianoCorrente[g];
    pianoFlat[g]={{
      colazione:COLAZIONI_DB[d.tipo].nome,
      pranzo_proteina:d.pranzo.proteina, pranzo_fecola:d.pranzo.fecola, pranzo_grasso:d.pranzo.grasso,
      pranzo_kcal:d.pranzo.macro?.kcal, pranzo_prot:d.pranzo.macro?.prot,
      cena_proteina:d.cena.speciale?('Speciale:'+d.cena.speciale):d.cena.proteina,
      cena_fecola:d.cena.fecola||'', cena_grasso:d.cena.grasso||'',
      cena_kcal:d.cena.macro?.kcal, cena_prot:d.cena.macro?.prot,
    }};
  }});
  const r1=await sheetsPost({{action:'savePianoEmanuele',piano:pianoFlat}});
  if(r1.error) {{ setSyncStatus('❌ '+r1.error); return; }}
  const spesaItems=Object.entries(spesaCorrente).map(([ingr,v])=>
    ({{ingrediente:ingr,quantita:v.qta,categoria:v.cat,spuntato:false}}));
  const r2=await sheetsPost({{action:'saveListaSpesa',spesa:spesaItems}});
  if(r2.error) {{ setSyncStatus('❌ '+r2.error); return; }}
  setSyncStatus('✅ Salvato su Sheets · '+now());
}}

async function caricaDaSheets() {{
  setSyncStatus('⏳ Caricamento...');
  const r=await sheetsGet({{action:'getPianoEmanuele'}});
  if(r.error||!r.piano) {{ setSyncStatus('❌ '+(r.error||'nessun piano')); return; }}
  GIORNI.forEach(g => {{
    if(!r.piano[g]) return;
    const row=r.piano[g];
    if(row.pranzo_proteina&&PROTEINE_DB[row.pranzo_proteina]) pianoCorrente[g].pranzo.proteina=row.pranzo_proteina;
    if(row.pranzo_fecola&&FECULENTI_DB[row.pranzo_fecola])   pianoCorrente[g].pranzo.fecola=row.pranzo_fecola;
    if(row.pranzo_grasso&&GRASSI_DB[row.pranzo_grasso])      pianoCorrente[g].pranzo.grasso=row.pranzo_grasso;
    if(row.cena_proteina&&PROTEINE_DB[row.cena_proteina])    pianoCorrente[g].cena.proteina=row.cena_proteina;
    if(row.cena_fecola&&FECULENTI_DB[row.cena_fecola])       pianoCorrente[g].cena.fecola=row.cena_fecola;
    if(row.cena_grasso&&GRASSI_DB[row.cena_grasso])          pianoCorrente[g].cena.grasso=row.cena_grasso;
  }});
  renderGiorni(); renderMacroRiepilogo();
  setSyncStatus('✅ Caricato da Sheets · '+now());
}}

// ── INIT ──────────────────────────────────────────────────────────────────────
initAlmanacco();
render();
// Al caricamento: leggi da Sheets (se disponibile), altrimenti mantieni dati embedded
if(APPS_SCRIPT_URL) {{
  setTimeout(async () => {{
    setSyncStatus('⏳ Caricamento da Sheets...');
    const r = await sheetsGet({{action:'getPianoEmanuele'}});
    if(r.piano && Object.keys(r.piano).length > 0) {{
      GIORNI.forEach(g => {{
        if(!r.piano[g]) return;
        const row = r.piano[g];
        if(row.pranzo_proteina && PROTEINE_DB[row.pranzo_proteina]) pianoCorrente[g].pranzo.proteina = row.pranzo_proteina;
        if(row.pranzo_fecola   && FECULENTI_DB[row.pranzo_fecola])  pianoCorrente[g].pranzo.fecola   = row.pranzo_fecola;
        if(row.pranzo_grasso   && GRASSI_DB[row.pranzo_grasso])     pianoCorrente[g].pranzo.grasso   = row.pranzo_grasso;
        if(row.cena_proteina   && PROTEINE_DB[row.cena_proteina])   pianoCorrente[g].cena.proteina   = row.cena_proteina;
        if(row.cena_fecola     && FECULENTI_DB[row.cena_fecola])    pianoCorrente[g].cena.fecola     = row.cena_fecola;
        if(row.cena_grasso     && GRASSI_DB[row.cena_grasso])       pianoCorrente[g].cena.grasso     = row.cena_grasso;
      }});
      renderGiorni();
      renderMacroRiepilogo();
      setSyncStatus('✅ Piano caricato da Sheets · ' + now());
    }} else {{
      setSyncStatus('📋 Dati locali (Sheets vuoto)');
    }}
  }}, 1000);
}}
</script>
</body>
</html>"""


def genera_html(piano, settimana):
    def _ser(d):
        return json.dumps(d, ensure_ascii=False)

    oggi = date.today()
    lun = oggi - timedelta(days=oggi.weekday())
    lun_prossima = lun + timedelta(7)
    sett_prossima = f"{lun_prossima.strftime('%d %b')} – {(lun_prossima+timedelta(6)).strftime('%d %b %Y')}"

    # 3 varianti settimana corrente (prima già generata)
    varianti_corrente = [piano, genera_settimana(), genera_settimana()]
    # 3 varianti settimana prossima
    varianti_prossima = [genera_settimana(), genera_settimana(), genera_settimana()]

    spese_corrente = [calcola_spesa(v) for v in varianti_corrente]
    spese_prossima = [calcola_spesa(v) for v in varianti_prossima]

    col_js = {k: {kk: vv for kk, vv in v.items() if kk != "spesa"} for k, v in COLAZIONI.items()}

    return HTML.format(
        settimana=settimana,
        nome_paziente=PAZIENTE["nome"],
        varianti_json=_ser([varianti_corrente, varianti_prossima]),
        settimane_json=_ser([settimana, sett_prossima]),
        spese_json=_ser([spese_corrente, spese_prossima]),
        proteine_json=_ser(PROTEINE),
        feculenti_json=_ser(FECULENTI),
        grassi_json=_ser(GRASSI),
        colazioni_json=_ser(col_js),
        giorni_json=_ser(GIORNI),
        giorni_tipo_json=_ser(GIORNI_TIPO),
        cena_sab_json=_ser(CENA_SAB),
        cena_dom_json=_ser(CENA_DOM),
        apps_script_url=APPS_SCRIPT_URL,
        data_oggi_iso=str(oggi),
    )


# ═══════════════════════════════════════════════════════
# GENERATORE HTML MENSILE
# ═══════════════════════════════════════════════════════

HTML_MESE = """<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Piano Mensile &middot; {nome_paziente}</title>
<style>
:root{{
  --bg:#f5f0e8;--paper:#fffdf8;--ink:#1a2820;--muted:#5a6b62;
  --green:#4f7a54;--green-light:#eef5ee;--green-soft:#d4e8d4;
  --amber:#d4820a;--amber-light:#fef9ee;--red:#c0392b;
  --blue:#1a6b9a;--blue-light:#e8f4fd;
  --line:#dde8da;--warm:#f2e3c4;
  --orange:#e07020;
}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      background:var(--bg);color:var(--ink);font-size:14px;line-height:1.5}}
.almanac{{background:linear-gradient(135deg,#1a2820,#2d4a35);color:#fff;padding:10px 20px;text-align:center}}
.almanac-date{{font-size:11px;opacity:.7;letter-spacing:.1em;text-transform:uppercase}}
.almanac-quote{{font-style:italic;font-size:13px;margin-top:3px;opacity:.9;max-width:620px;margin-inline:auto}}
.page{{max-width:1500px;margin:0 auto;padding:12px}}
header{{background:linear-gradient(135deg,#fffdf8,#eef5ee);border:1px solid var(--line);
        border-radius:16px;padding:16px 20px;margin-bottom:10px;box-shadow:0 4px 16px rgba(26,40,32,.06)}}
.header-row{{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px}}
.patient-info h1{{font-size:clamp(16px,2.5vw,24px);color:var(--ink)}}
.patient-info p{{color:var(--muted);font-size:12px;margin-top:2px}}
.targets{{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}}
.target-pill{{background:var(--green-soft);border:1px solid var(--green);color:var(--green);
              padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600}}
.header-controls{{display:flex;gap:6px;align-items:center;flex-wrap:wrap}}
.btn{{padding:7px 12px;border-radius:9px;border:1px solid var(--line);background:var(--paper);
      color:var(--green);cursor:pointer;font-size:12px;font-family:inherit;transition:all .15s;font-weight:500}}
.btn:hover{{background:var(--green);color:#fff}}
.btn.primary{{background:var(--green);color:#fff;border-color:var(--green)}}
.btn.primary:hover{{background:#3a5c3e}}
.btn.amber{{background:var(--amber);color:#fff;border-color:var(--amber)}}
.btn.amber:hover{{background:#b06d00}}
#sync-status{{font-size:11px;color:var(--muted);margin-top:4px;text-align:right}}
.month-bar{{display:flex;align-items:center;gap:8px;margin-bottom:10px;background:var(--paper);
            border:1px solid var(--line);border-radius:12px;padding:8px 14px;flex-wrap:wrap}}
.month-nav-btn{{background:none;border:1px solid var(--line);border-radius:8px;padding:4px 12px;
                cursor:pointer;font-size:16px;color:var(--green);font-family:inherit;font-weight:700}}
.month-nav-btn:hover{{background:var(--green);color:#fff}}
.month-label{{flex:1;font-size:15px;font-weight:700;color:var(--ink);text-align:center}}
.variant-badge{{font-size:11px;color:var(--muted);white-space:nowrap}}
.layout{{display:grid;grid-template-columns:1fr 290px;gap:12px;align-items:start}}
@media(max-width:1000px){{.layout{{grid-template-columns:1fr}}}}
.cal-grid{{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;background:var(--paper);
           border:1px solid var(--line);border-radius:12px;overflow:hidden;
           box-shadow:0 2px 8px rgba(26,40,32,.05);padding:2px}}
.cal-header-cell{{background:linear-gradient(135deg,#1a2820,#2d4a35);color:#fff;
                  text-align:center;padding:6px 2px;font-size:11px;font-weight:700;
                  letter-spacing:.05em;border-radius:4px}}
.cal-cell{{background:var(--paper);border:1px solid var(--line);border-radius:6px;
           min-height:82px;padding:5px;cursor:pointer;transition:all .12s;position:relative}}
.cal-cell:hover{{background:var(--green-light);border-color:var(--green-soft)}}
.cal-cell.today{{border:2px solid var(--green);box-shadow:0 0 0 1px var(--green-soft)}}
.cal-cell.empty{{background:transparent;border-color:transparent;cursor:default}}
.cal-cell.weekend{{background:#fdf8f0}}
.cal-cell.has-exception{{border-color:var(--orange)}}
.cal-day-num{{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px;
              display:flex;align-items:center;justify-content:space-between}}
.today-dot{{width:6px;height:6px;background:var(--green);border-radius:50%;display:inline-block}}
.cal-prot{{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
           padding:1px 3px;border-radius:3px;margin-bottom:1px}}
.cal-prot.pranzo{{background:#eef5ee;color:var(--green)}}
.cal-prot.cena{{background:#e8f4fd;color:var(--blue)}}
.cal-prot.speciale{{background:var(--amber-light);color:var(--amber)}}
.cal-prot.exc{{background:#fde4e4;color:var(--red)}}
.exc-flag{{font-size:11px;cursor:pointer;padding:1px 3px;border-radius:3px;transition:all .12s;line-height:1}}
.exc-flag.active{{color:var(--orange)}}
.exc-flag.inactive{{color:#ccc}}
.sidebar{{display:flex;flex-direction:column;gap:10px;position:sticky;top:16px}}
.card{{background:var(--paper);border:1px solid var(--line);border-radius:12px;
       padding:14px;box-shadow:0 2px 8px rgba(26,40,32,.05)}}
.card h3{{font-size:14px;color:var(--green);margin-bottom:10px;display:flex;align-items:center;gap:6px}}
.card h3::before{{content:"";width:18px;height:2px;background:var(--green)}}
.macro-riga{{display:flex;justify-content:space-between;align-items:center;
             padding:4px 0;border-bottom:1px solid var(--line);font-size:12px}}
.macro-riga:last-child{{border:none}}
.macro-val{{font-weight:700;color:var(--green)}}
.progress-bar{{height:5px;border-radius:3px;background:var(--line);margin-top:2px;overflow:hidden}}
.progress-fill{{height:100%;border-radius:3px;background:var(--green);transition:width .3s}}
.spesa-gruppo{{margin-bottom:10px}}
.spesa-gruppo h4{{font-size:11px;font-weight:700;color:var(--green);margin-bottom:4px;
                  padding-bottom:2px;border-bottom:1px solid var(--line)}}
.spesa-item{{display:flex;align-items:center;gap:5px;padding:2px 0;font-size:11px}}
.spesa-item label{{flex:1;cursor:pointer}}
.spesa-item span{{color:var(--muted);white-space:nowrap;font-size:10px}}
.spesa-item.checked label{{text-decoration:line-through;opacity:.45}}
.spesa-check{{accent-color:var(--green);cursor:pointer}}
.rec-item{{font-size:11px;padding:4px 0;border-bottom:1px solid var(--line);color:var(--muted)}}
.rec-item:last-child{{border:none}}
.rec-item strong{{color:var(--green)}}
dialog{{border:none;border-radius:16px;padding:0;max-width:520px;width:95%;
        box-shadow:0 20px 60px rgba(0,0,0,.2)}}
dialog::backdrop{{background:rgba(26,40,32,.4);backdrop-filter:blur(3px)}}
.modal-hdr{{padding:16px 18px 12px;border-bottom:1px solid var(--line)}}
.modal-hdr h2{{font-size:17px;color:var(--ink)}}
.modal-hdr p{{font-size:11px;color:var(--muted);margin-top:2px}}
.modal-body{{padding:12px 18px;max-height:65vh;overflow-y:auto}}
.modal-ftr{{padding:10px 18px 14px;display:flex;gap:8px;justify-content:flex-end;border-top:1px solid var(--line)}}
.opt-card{{border:1px solid var(--line);border-radius:10px;padding:10px;cursor:pointer;
           transition:all .12s;margin-bottom:6px;background:var(--bg)}}
.opt-card:hover{{border-color:var(--green);background:var(--green-light)}}
.opt-card strong{{font-size:12px;color:var(--ink)}}
.opt-card .opt-q{{font-size:10px;color:var(--muted);margin-top:1px}}
.opt-card .opt-macro{{font-size:10px;color:var(--green);font-weight:600;margin-top:3px}}
.opt-card .opt-note{{font-size:10px;color:var(--amber);margin-top:2px}}
.comp-tipo{{font-size:9px;padding:1px 5px;border-radius:999px;margin-left:3px;font-weight:600}}
.t-magra{{background:#d4edd4;color:#1a6b1a}}
.t-grassa{{background:#fde8c8;color:#8b4500}}
.macro-badge{{display:inline-flex;align-items:center;gap:5px;font-size:10px;
              margin-top:4px;padding:2px 7px;border-radius:5px}}
.macro-ok{{background:#d4edd4;color:#1a5c1a}}
.macro-warn{{background:#fde8c8;color:#8b4500}}
.macro-low{{background:#fde4e4;color:#8b0000}}
.detail-section{{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line)}}
.detail-section:last-child{{border-bottom:none;margin-bottom:0}}
.detail-section h4{{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;
                    letter-spacing:.08em;margin-bottom:8px}}
.det-comp{{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;
           cursor:pointer;transition:background .12s;border:1px solid transparent;margin-bottom:4px}}
.det-comp:hover{{background:var(--green-light);border-color:var(--green-soft)}}
.det-comp-icon{{font-size:16px;flex-shrink:0}}
.det-comp-body{{flex:1;min-width:0}}
.det-comp-nome{{font-size:13px;font-weight:600}}
.det-comp-detail{{font-size:11px;color:var(--muted)}}
.det-comp.fixed{{cursor:default}}
.det-comp.fixed:hover{{background:none;border-color:transparent}}
.exc-toggle{{display:flex;align-items:center;gap:8px;padding:8px;background:var(--amber-light);
             border-radius:8px;cursor:pointer;border:1px solid var(--warm)}}
.exc-toggle input[type=checkbox]{{accent-color:var(--orange);width:16px;height:16px;cursor:pointer}}
.exc-toggle label{{font-size:12px;font-weight:600;color:var(--amber);cursor:pointer}}
.exc-note-area{{width:100%;margin-top:8px;padding:8px 10px;border:1px solid var(--line);
                border-radius:8px;font-size:12px;font-family:inherit;resize:vertical;
                min-height:60px;outline:none}}
.exc-note-area:focus{{border-color:var(--amber);box-shadow:0 0 0 2px #fde8c8}}
.email-form label{{display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:var(--ink)}}
.email-input{{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;
              font-size:13px;font-family:inherit;outline:none}}
.email-input:focus{{border-color:var(--green);box-shadow:0 0 0 2px var(--green-soft)}}
.email-default-row{{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;color:var(--muted)}}
.arch-item{{border:1px solid var(--line);border-radius:10px;padding:10px 14px;cursor:pointer;
            transition:all .12s;margin-bottom:6px;background:var(--bg);
            display:flex;align-items:center;justify-content:space-between}}
.arch-item:hover{{border-color:var(--green);background:var(--green-light)}}
.arch-item-name{{font-size:13px;font-weight:600}}
.arch-item-meta{{font-size:11px;color:var(--muted)}}
.mobile-bar{{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--paper);
             border-top:1px solid var(--line);padding:8px 12px;gap:6px;z-index:300;
             box-shadow:0 -4px 16px rgba(0,0,0,.08)}}
@media(max-width:700px){{
  .mobile-bar{{display:flex}}
  .mobile-bar .btn{{flex:1;text-align:center;font-size:11px;padding:8px 4px}}
  body{{padding-bottom:68px}}
  .cal-cell{{min-height:60px}}
  .cal-prot{{font-size:9px}}
}}
@media print{{
  .sidebar,.btn,.header-controls,dialog,.mobile-bar,.almanac,.month-bar{{display:none!important}}
  .layout{{grid-template-columns:1fr}}
  .cal-cell{{min-height:70px}}
}}
</style>
</head>
<body>

<div class="almanac" id="almanac-bar">
  <div class="almanac-date" id="almanac-date"></div>
  <div class="almanac-quote" id="almanac-quote"></div>
</div>

<div class="page">
<header>
  <div class="header-row">
    <div class="patient-info">
      <h1>Piano Alimentare &middot; {nome_paziente}</h1>
      <p>Applicazione sviluppata da Serafino Resout</p>
      <div class="targets">
        <span class="target-pill">&#127919; 178g prot/giorno</span>
        <span class="target-pill">&#9889; 620 kcal per pasto</span>
        <span class="target-pill">&#128170; 53g prot per pasto</span>
        <span class="target-pill">&#128167; 1.5&ndash;2L acqua</span>
      </div>
    </div>
    <div class="header-controls">
      <button class="btn" onclick="salvaMensileSheets()">&#9729;&#65039; Sheets</button>
      <button class="btn" onclick="apriArchivio()">&#128218; Archivio</button>
      <button class="btn amber" onclick="apriModalEmail()">&#9993;&#65039; Spesa</button>
      <button class="btn primary" onclick="window.print()">&#128424; Stampa</button>
    </div>
  </div>
  <div id="sync-status"></div>
</header>

<div class="month-bar">
  <button class="month-nav-btn" onclick="cambiaVista(-1)">&larr;</button>
  <span class="month-label" id="month-label"></span>
  <button class="month-nav-btn" onclick="cambiaVista(1)">&rarr;</button>
  <span class="variant-badge" id="variant-badge">Variante 1/2</span>
  <button class="btn" onclick="rigeneraVariante()">&#127922; Variante</button>
</div>

<div class="layout">
  <section>
    <div class="cal-grid" id="cal-grid"></div>
  </section>
  <aside class="sidebar">
    <div class="card">
      <h3>Media mensile macros</h3>
      <div id="macro-riepilogo"></div>
    </div>
    <div class="card">
      <h3>Regole chiave</h3>
      <div class="rec-item"><strong>Verdure</strong> &ge; 1/3 del piatto a pranzo e cena</div>
      <div class="rec-item"><strong>Proteine</strong> 2g/kg = 178g/giorno dalla colazione</div>
      <div class="rec-item"><strong>Grasso cottura</strong> max 1 cac olio (LMV colazione)</div>
      <div class="rec-item"><strong>Shake 16:00</strong> whey 30g + creatina 5g ogni giorno</div>
      <div class="rec-item"><strong>Acqua</strong> 1.5&ndash;2 litri tra i pasti</div>
      <div class="rec-item"><strong>Vinaigrette</strong> 40g skyr+aceto sidro+balsamico+senape</div>
      <div class="rec-item"><strong>Salmone sockeye</strong> preferire per omega-3</div>
    </div>
    <div class="card">
      <h3>Lista della Spesa</h3>
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px">
        <button class="btn" style="padding:4px 9px;font-size:13px" onclick="cambiaSettimanaSpesa(-1)">&#8249;</button>
        <span id="sett-spesa-label" style="flex:1;text-align:center;font-size:11px;color:var(--muted);font-weight:600"></span>
        <button class="btn" style="padding:4px 9px;font-size:13px" onclick="cambiaSettimanaSpesa(1)">&#8250;</button>
      </div>
      <div id="spesa-container"></div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <button class="btn" style="flex:1" onclick="stampaSpesa()">&#128424; Stampa</button>
        <button class="btn amber" style="flex:1" onclick="apriModalEmail()">&#9993;&#65039; Invia</button>
      </div>
    </div>
  </aside>
</div>
</div>

<div class="mobile-bar">
  <button class="btn" onclick="rigeneraVariante()">&#127922; Variante</button>
  <button class="btn" onclick="cambiaVista(1)">&#128197; Mese +</button>
  <button class="btn amber" onclick="apriModalEmail()">&#9993;&#65039; Spesa</button>
</div>

<!-- DETAIL MODAL -->
<dialog id="modal-giorno">
  <div class="modal-hdr">
    <h2 id="dg-titolo">Dettaglio giorno</h2>
    <p id="dg-sotto"></p>
  </div>
  <div class="modal-body" id="dg-body"></div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal-giorno').close()">Chiudi</button>
    <button class="btn primary" onclick="salvaEccezione()">&#128190; Salva eccezione</button>
  </div>
</dialog>

<!-- SWAP MODAL -->
<dialog id="modal-swap">
  <div class="modal-hdr">
    <h2 id="sw-titolo">Cambia componente</h2>
    <p id="sw-sotto"></p>
  </div>
  <div class="modal-body" id="sw-body"></div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal-swap').close()">Annulla</button>
  </div>
</dialog>

<!-- EMAIL MODAL -->
<dialog id="modal-email">
  <div class="modal-hdr">
    <h2>&#9993;&#65039; Invia Lista Spesa</h2>
    <p>Riceverai la lista della spesa via email</p>
  </div>
  <div class="modal-body">
    <div class="email-form">
      <label for="email-input">Indirizzo email destinatario</label>
      <input class="email-input" type="email" id="email-input"
             placeholder="nome@esempio.it" oninput="aggiornaEmailUI()">
      <div class="email-default-row">
        <input type="checkbox" id="email-default-cb" onchange="toggleDefaultEmail()">
        <label for="email-default-cb">Salva come email predefinita</label>
      </div>
    </div>
  </div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal-email').close()">Annulla</button>
    <button class="btn amber" id="btn-invia-email" onclick="inviaEmail()" disabled>&#9993;&#65039; Invia</button>
  </div>
</dialog>

<!-- ARCHIVE MODAL -->
<dialog id="modal-archivio">
  <div class="modal-hdr">
    <h2>&#128218; Archivio Piani</h2>
    <p>Mesi salvati su Google Sheets</p>
  </div>
  <div class="modal-body" id="arch-body">
    <div style="text-align:center;color:var(--muted);padding:20px">Caricamento...</div>
  </div>
  <div class="modal-ftr">
    <button class="btn" onclick="document.getElementById('modal-archivio').close()">Chiudi</button>
  </div>
</dialog>

<script>
// ── DATI EMBEDDED ─────────────────────────────────────────────────────────────
const VARIANTI_MESI   = {varianti_mesi_json};
const MESI_INFO       = {mesi_info_json};
const SPESE_MESI          = {spese_mesi_json};
const SPESE_SETTIMANE     = {spese_settimane_json};
const PROTEINE_DB     = {proteine_json};
const FECULENTI_DB    = {feculenti_json};
const GRASSI_DB       = {grassi_json};
const COLAZIONI_DB    = {colazioni_json};
const CENA_SAB        = {cena_sab_json};
const CENA_DOM        = {cena_dom_json};
const TARGET          = {{kcal:620, prot:53}};
const APPS_SCRIPT_URL = "{apps_script_url}";
const DATA_OGGI       = new Date("{data_oggi_iso}");

let meseIdx          = 0;
let varianteIdx      = 0;
let settimanSpesaIdx = 0;
let pianoCorrente    = null;
let spesaCorrente    = null;
let detailCtx = null;
let swapCtx   = null;

// ── FRASI ALMANACCO ───────────────────────────────────────────────────────────
const FRASI = [
  "Il corpo realizza ci\u00f2 che la mente crede.",
  "Ogni pasto \u00e8 un'opportunit\u00e0 per nutrire la tua energia.",
  "La disciplina \u00e8 il ponte tra gli obiettivi e i risultati.",
  "Non si tratta di perfezione, ma di progresso costante.",
  "Mangia bene, muoviti bene, vivi bene.",
  "Il cambiamento inizia con una scelta \u2014 anche quella di oggi.",
  "Il tuo corpo \u00e8 un tempio: trattalo di conseguenza.",
  "La forza non viene dalla capacit\u00e0 fisica, ma dalla volont\u00e0 indomita.",
  "Investire nella propria salute \u00e8 il miglior investimento che esista.",
  "Ogni mattina \u00e8 una nuova opportunit\u00e0 per fare la scelta giusta.",
  "L'alimentazione \u00e8 la base su cui si costruisce tutto il resto.",
  "La costanza batte il talento quando il talento non \u00e8 costante.",
  "Non aspettare la motivazione \u2014 agisci e la motivazione arriver\u00e0.",
  "Piccoli passi ogni giorno portano a grandi trasformazioni.",
  "Il tuo futuro io ti ringrazier\u00e0 per le scelte di oggi.",
  "La salute \u00e8 una pratica quotidiana, non una destinazione.",
  "Nutr\u00ecti come se il tuo corpo fosse la cosa pi\u00f9 preziosa che possiedi.",
  "La pazienza \u00e8 il segreto di ogni trasformazione duratura.",
  "Ogni grammo di proteina \u00e8 un mattone per la tua forza.",
  "Il benessere non \u00e8 un lusso, \u00e8 una necessit\u00e0.",
  "La coerenza supera sempre la perfezione.",
  "Ascolta il tuo corpo: sa pi\u00f9 di quanto pensi.",
  "Un buon pasto \u00e8 un atto d'amore verso s\u00e9 stessi.",
  "La fatica di oggi \u00e8 la forza di domani.",
  "Scegliere bene a tavola \u00e8 scegliere bene per la vita.",
  "Il corpo che vuoi \u00e8 costruito con le abitudini di ogni giorno.",
  "Non esiste scorciatoia per una salute duratura.",
  "Ogni variante \u00e8 una nuova scoperta gustosa.",
  "Il successo nel benessere si misura in settimane e mesi.",
  "Idratarsi \u00e8 il gesto pi\u00f9 semplice e pi\u00f9 potente per la salute.",
];
const MESI_IT   = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
                   "luglio","agosto","settembre","ottobre","novembre","dicembre"];
const GIORNI_IT = ["domenica","luned\u00ec","marted\u00ec","mercoled\u00ec","gioved\u00ec","venerd\u00ec","sabato"];
const GIORNI_SHORT = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];

function getWeekNumber(d) {{
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(),0,1));
  return Math.ceil((((dt - yearStart) / 86400000) + 1)/7);
}}

function initAlmanacco() {{
  const d = DATA_OGGI;
  const wk = getWeekNumber(d);
  const dayStr = GIORNI_IT[d.getDay()];
  document.getElementById('almanac-date').textContent =
    dayStr.charAt(0).toUpperCase()+dayStr.slice(1)+', '+d.getDate()+' '+MESI_IT[d.getMonth()]+' '+d.getFullYear()+' \u00b7 Settimana '+wk;
  document.getElementById('almanac-quote').textContent =
    '\u201c' + FRASI[(d.getDate() + d.getMonth()*31 + wk) % FRASI.length] + '\u201d';
}}

// ── RENDER ────────────────────────────────────────────────────────────────────
function _initSettimanSpesa() {{
  const oggiISO = DATA_OGGI.toISOString().slice(0,10);
  const settimane = SPESE_SETTIMANE[meseIdx][varianteIdx];
  settimanSpesaIdx = 0;
  for(let i=0; i<settimane.length; i++) {{
    if(settimane[i].dal <= oggiISO && oggiISO <= settimane[i].al) {{ settimanSpesaIdx = i; break; }}
  }}
}}

function render() {{
  pianoCorrente = JSON.parse(JSON.stringify(VARIANTI_MESI[meseIdx][varianteIdx]));
  _initSettimanSpesa();
  const settimane = SPESE_SETTIMANE[meseIdx][varianteIdx];
  spesaCorrente = settimane[settimanSpesaIdx].spesa;
  const info = MESI_INFO[meseIdx];
  document.getElementById('month-label').textContent = info.nome;
  document.getElementById('variant-badge').textContent =
    'Variante '+(varianteIdx+1)+'/'+VARIANTI_MESI[meseIdx].length;
  renderCalendario();
  renderMacroRiepilogo();
  renderSpesa();
}}

function cambiaVista(delta) {{
  const newIdx = meseIdx + delta;
  if(newIdx < 0 || newIdx >= MESI_INFO.length) return;
  meseIdx = newIdx;
  varianteIdx = 0;
  render();
}}

function rigeneraVariante() {{
  const nVar = VARIANTI_MESI[meseIdx].length;
  varianteIdx = (varianteIdx + 1) % nVar;
  render();
  setSyncStatus('\\ud83c\\udfb2 Variante '+(varianteIdx+1)+'/'+nVar);
}}

// ── CALENDARIO ────────────────────────────────────────────────────────────────
function renderCalendario() {{
  const info = MESI_INFO[meseIdx];
  const anno = info.anno, mese = info.mese, numGiorni = info.num_giorni;
  const primoJS = new Date(anno, mese-1, 1).getDay();
  const offsetLun = primoJS === 0 ? 6 : primoJS - 1;
  const oggiISO = DATA_OGGI.toISOString().slice(0,10);

  let html = GIORNI_SHORT.map(g =>
    `<div class="cal-header-cell">${{g}}</div>`).join('');

  for(let i=0; i<offsetLun; i++) {{
    html += `<div class="cal-cell empty"></div>`;
  }}

  for(let g=1; g<=numGiorni; g++) {{
    const iso = anno+'-'+String(mese).padStart(2,'0')+'-'+String(g).padStart(2,'0');
    const d = pianoCorrente[iso];
    const isOggi = iso === oggiISO;
    const isWeekend = d && (d.tipo === 'SAB' || d.tipo === 'DOM');
    const hasExc = d && d.eccezione;

    let cls = 'cal-cell';
    if(isOggi) cls += ' today';
    if(isWeekend) cls += ' weekend';
    if(hasExc) cls += ' has-exception';

    let pranzoTxt = '', cenaTxt = '', pranzoClass = 'pranzo', cenaClass = 'cena';
    if(d) {{
      if(hasExc) {{
        pranzoTxt = '\u26a0\ufe0f Eccezione';
        pranzoClass = 'exc';
      }} else {{
        pranzoTxt = d.pranzo && d.pranzo.proteina ? d.pranzo.proteina.slice(0,15) : '';
      }}
      if(d.cena.speciale === 'SAB') {{ cenaTxt = 'Pasta sab'; cenaClass = 'speciale'; }}
      else if(d.cena.speciale === 'DOM') {{ cenaTxt = 'Beans dom'; cenaClass = 'speciale'; }}
      else {{ cenaTxt = d.cena.proteina ? d.cena.proteina.slice(0,15) : ''; }}
    }}

    html += `<div class="${{cls}}" onclick="apriGiorno('${{iso}}',false)">
      <div class="cal-day-num">
        <span>${{g}}</span>
        ${{isOggi ? '<span class="today-dot"></span>' : ''}}
        ${{d ? `<span class="exc-flag ${{hasExc?'active':'inactive'}}" title="Eccezione"
          onclick="event.stopPropagation();apriGiorno('${{iso}}',true)">\u2691</span>` : ''}}
      </div>
      ${{d ? `
        <div class="cal-prot ${{pranzoClass}}">\\ud83e\\udd69 ${{pranzoTxt}}</div>
        ${{!hasExc ? `<div class="cal-prot ${{cenaClass}}">\\ud83c\\udf19 ${{cenaTxt}}</div>` : ''}}
        ${{hasExc && d.note_eccezione ? `<div style="font-size:9px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px">${{d.note_eccezione.slice(0,18)}}</div>` : ''}}
      ` : ''}}
    </div>`;
  }}

  const totCelle = offsetLun + numGiorni;
  const righe = Math.ceil(totCelle / 7);
  const vuotiFine = righe * 7 - totCelle;
  for(let i=0; i<vuotiFine; i++) {{
    html += `<div class="cal-cell empty"></div>`;
  }}

  document.getElementById('cal-grid').innerHTML = html;
}}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function apriGiorno(iso, focusExc) {{
  detailCtx = {{iso, focusExc}};
  const d = pianoCorrente[iso];
  if(!d) return;
  const dataObj = new Date(iso+'T12:00:00');
  const gNome = GIORNI_IT[dataObj.getDay()];
  document.getElementById('dg-titolo').textContent =
    gNome.charAt(0).toUpperCase()+gNome.slice(1)+' '+dataObj.getDate()+' '+MESI_IT[dataObj.getMonth()];
  document.getElementById('dg-sotto').textContent = 'Tipo: '+d.tipo+' \u00b7 '+d.colazione;

  const col = COLAZIONI_DB[d.tipo];
  const colItems = col && col.componenti ?
    col.componenti.map(c => `<div style="font-size:12px;padding:3px 0;border-bottom:1px dashed var(--line)">${{c}}</div>`).join('') : '';

  const pranzoMacro = renderMacroBadge(d.pranzo.macro);
  const cenaMacro = renderMacroBadge(d.cena.macro);

  let cenaHtml = '';
  if(d.cena.speciale === 'SAB') {{
    cenaHtml = `<div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:6px">\\ud83c\\udf5d ${{CENA_SAB.nome}}</div>
      ${{CENA_SAB.componenti.map(c=>`<div style="font-size:11px;color:var(--muted);padding:1px 0">${{c}}</div>`).join('')}}
      ${{cenaMacro}}`;
  }} else if(d.cena.speciale === 'DOM') {{
    cenaHtml = `<div style="font-size:12px;color:var(--amber);font-weight:600;margin-bottom:6px">\\ud83e\\uded8 ${{CENA_DOM.nome}}</div>
      ${{CENA_DOM.componenti.map(c=>`<div style="font-size:11px;color:var(--muted);padding:1px 0">${{c}}</div>`).join('')}}
      ${{cenaMacro}}`;
  }} else {{
    cenaHtml = `
      ${{renderDetComp(iso,'cena','proteina','\\ud83e\\udd69',d.cena.proteina,PROTEINE_DB)}}
      ${{renderDetComp(iso,'cena','fecola','\\ud83c\\udf3e',d.cena.fecola,FECULENTI_DB)}}
      ${{renderDetComp(iso,'cena','grasso','\\ud83e\\udd51',d.cena.grasso,GRASSI_DB)}}
      <div class="det-comp fixed"><span class="det-comp-icon">\\ud83e\\udd66</span>
        <div class="det-comp-body"><div class="det-comp-nome">Verdure crude/cotte</div>
          <div class="det-comp-detail">\u2265 1/3 \u2013 \u00bd piatto \u00b7 libero</div></div></div>
      ${{cenaMacro}}`;
  }}

  const excChecked = d.eccezione ? 'checked' : '';
  const excNote = (d.note_eccezione || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  document.getElementById('dg-body').innerHTML = `
    <div class="detail-section">
      <h4>\u2600\ufe0f Colazione</h4>
      ${{colItems}}
      ${{col && col.nota ? `<div style="font-size:10px;color:var(--amber);margin-top:4px">\\ud83d\\udca1 ${{col.nota}}</div>` : ''}}
    </div>
    <div class="detail-section">
      <h4>\\ud83e\\udd57 Pranzo 12:00</h4>
      ${{renderDetComp(iso,'pranzo','proteina','\\ud83e\\udd69',d.pranzo.proteina,PROTEINE_DB)}}
      ${{renderDetComp(iso,'pranzo','fecola','\\ud83c\\udf3e',d.pranzo.fecola,FECULENTI_DB)}}
      ${{renderDetComp(iso,'pranzo','grasso','\\ud83e\\udd51',d.pranzo.grasso,GRASSI_DB)}}
      <div class="det-comp fixed"><span class="det-comp-icon">\\ud83e\\udd66</span>
        <div class="det-comp-body"><div class="det-comp-nome">Verdure crude/cotte</div>
          <div class="det-comp-detail">\u2265 1/3 \u2013 \u00bd piatto \u00b7 libero</div></div></div>
      ${{pranzoMacro}}
    </div>
    <div class="detail-section">
      <h4>\\ud83d\\udc8a Shake &amp; Go\u00fbter 16:00</h4>
      <div style="font-size:12px;padding:3px 0">Whey 30g + Creatina 5g</div>
      <div style="font-size:12px;padding:3px 0;color:var(--muted)">Olive/formaggio/hummus + 100g cottage cheese + crudit\u00e9s</div>
    </div>
    <div class="detail-section">
      <h4>\\ud83c\\udf19 Cena 19:00</h4>
      ${{cenaHtml}}
    </div>
    <div class="detail-section" id="exc-section">
      <h4>\u26a0\ufe0f Eccezione</h4>
      <div class="exc-toggle" onclick="toggleExcCheckbox()">
        <input type="checkbox" id="exc-cb" ${{excChecked}} onclick="event.stopPropagation()">
        <label for="exc-cb">Questo giorno ha un'eccezione (pasto fuori programma, imprevisto, ecc.)</label>
      </div>
      <textarea class="exc-note-area" id="exc-note" placeholder="Note sull'eccezione (es. cena al ristorante, compleanno...)">${{excNote}}</textarea>
    </div>
  `;

  document.getElementById('modal-giorno').showModal();
  if(focusExc) {{
    setTimeout(() => {{
      const el = document.getElementById('exc-section');
      if(el) el.scrollIntoView({{behavior:'smooth', block:'center'}});
    }}, 120);
  }}
}}

function toggleExcCheckbox() {{
  const cb = document.getElementById('exc-cb');
  if(cb) cb.checked = !cb.checked;
}}

function renderDetComp(iso, pasto, campo, icon, nome, db) {{
  const v = db[nome] || {{}};
  const tipoTag = v.tipo ? `<span class="comp-tipo t-${{v.tipo}}">${{v.tipo}}</span>` : '';
  const detail = [v.q_str||'', v.prot ? v.prot+'g prot' : '', v.kcal ? v.kcal+' kcal' : ''].filter(Boolean).join(' \u00b7 ');
  const safeIso = iso.replace(/'/g,"\\'");
  return `<div class="det-comp" onclick="apriSwap('${{safeIso}}','${{pasto}}','${{campo}}')">
    <span class="det-comp-icon">${{icon}}</span>
    <div class="det-comp-body">
      <div class="det-comp-nome">${{nome||'(nessuno)'}}${{tipoTag}}</div>
      <div class="det-comp-detail">${{detail}}</div>
    </div>
  </div>`;
}}

function renderMacroBadge(macro) {{
  if(!macro) return '';
  const ok = macro.prot >= TARGET.prot * 0.9, med = macro.prot >= TARGET.prot * 0.75;
  const cls = ok ? 'macro-ok' : med ? 'macro-warn' : 'macro-low';
  return `<div class="macro-badge ${{cls}}">\u26a1 ${{macro.kcal}} kcal \u00b7 \\ud83d\\udcaa ${{macro.prot}}g prot ${{ok ? '\u2705' : '\u26a0\ufe0f'}}</div>`;
}}

function salvaEccezione() {{
  if(!detailCtx) return;
  const iso = detailCtx.iso;
  const cb = document.getElementById('exc-cb');
  const note = (document.getElementById('exc-note') || {{}}).value || '';
  if(pianoCorrente[iso]) {{
    pianoCorrente[iso].eccezione = cb ? cb.checked : false;
    pianoCorrente[iso].note_eccezione = note.trim();
  }}
  document.getElementById('modal-giorno').close();
  renderCalendario();
  renderMacroRiepilogo();
  if(APPS_SCRIPT_URL) {{
    sheetsPost({{action:'saveEccezione', data:iso,
                eccezione: pianoCorrente[iso] ? pianoCorrente[iso].eccezione : false,
                note: note.trim()}})
      .then(r => {{ if(r && r.success) setSyncStatus('\u2705 Eccezione salvata \u00b7 '+now()); }});
  }}
}}

// ── SWAP MODAL ────────────────────────────────────────────────────────────────
function apriSwap(iso, pasto, campo) {{
  swapCtx = {{iso, pasto, campo}};
  const db = campo === 'proteina' ? PROTEINE_DB : campo === 'fecola' ? FECULENTI_DB : GRASSI_DB;
  const corrente = pianoCorrente[iso] && pianoCorrente[iso][pasto] ? pianoCorrente[iso][pasto][campo] : '';
  const titoli = {{proteina:'\\ud83e\\udd69 Cambia proteina', fecola:'\\ud83c\\udf3e Cambia fecola', grasso:'\\ud83e\\udd51 Cambia grasso'}};
  document.getElementById('sw-titolo').textContent = titoli[campo] || 'Cambia componente';
  document.getElementById('sw-sotto').textContent = 'Attuale: '+(corrente||'nessuno')+' \u00b7 '+iso+' '+pasto;
  document.getElementById('sw-body').innerHTML = Object.entries(db).map(([nome, v]) => {{
    const sel = nome === corrente;
    const tipoTag = v.tipo ? `<span class="comp-tipo t-${{v.tipo}}" style="margin-left:3px">${{v.tipo}}</span>` : '';
    const safeNome = nome.replace(/'/g,"\\'");
    return `<div class="opt-card" onclick="scegliComponente('${{safeNome}}')"
      style="${{sel ? 'border-color:var(--green);background:var(--green-light)' : ''}}">
      <strong>${{nome}}</strong>${{tipoTag}}
      <div class="opt-q">${{v.q_str||''}} ${{sel ? '\u00b7 \u2705 Attuale' : ''}}</div>
      <div class="opt-macro">${{v.prot ? v.prot+'g prot \u00b7 ' : ''}}${{v.kcal}} kcal</div>
      ${{v.note ? `<div class="opt-note">\\ud83d\\udca1 ${{v.note}}</div>` : ''}}
    </div>`;
  }}).join('');
  document.getElementById('modal-swap').showModal();
}}

function scegliComponente(nome) {{
  if(!swapCtx) return;
  const {{iso, pasto, campo}} = swapCtx;
  if(!pianoCorrente[iso] || !pianoCorrente[iso][pasto]) return;
  pianoCorrente[iso][pasto][campo] = nome;
  const p = pianoCorrente[iso][pasto];
  if(p.proteina && p.fecola && p.grasso) {{
    const pDB = PROTEINE_DB[p.proteina]||{{}};
    const fDB = FECULENTI_DB[p.fecola]||{{}};
    const gDB = GRASSI_DB[p.grasso]||{{}};
    p.macro = {{
      kcal: (pDB.kcal||0)+(fDB.kcal||0)+(gDB.kcal||0)+50,
      prot: (pDB.prot||0)+(fDB.prot||0)+(gDB.prot||0)+3
    }};
  }}
  document.getElementById('modal-swap').close();
  renderCalendario();
  renderMacroRiepilogo();
  if(detailCtx && detailCtx.iso === iso) {{
    apriGiorno(iso, false);
  }}
  if(APPS_SCRIPT_URL) {{
    sheetsPost({{action:'updateComponente', data:iso, pasto, tipo_comp:campo, nuovo_valore:nome}})
      .then(r => {{ if(r && r.success) setSyncStatus('\u2705 Sheets \u00b7 '+now()); }});
  }}
}}

// ── MACRO RIEPILOGO ───────────────────────────────────────────────────────────
function renderMacroRiepilogo() {{
  let totProt=0, totKcal=0, n=0;
  Object.values(pianoCorrente).forEach(d => {{
    if(d.eccezione) return;
    const col = COLAZIONI_DB[d.tipo];
    totProt += (col && col.macro ? col.macro.prot : 0) + (d.pranzo.macro ? d.pranzo.macro.prot : 0) + (d.cena.macro ? d.cena.macro.prot : 0);
    totKcal += (col && col.macro ? col.macro.kcal : 0) + (d.pranzo.macro ? d.pranzo.macro.kcal : 0) + (d.cena.macro ? d.cena.macro.kcal : 0);
    n++;
  }});
  const avgProt = n ? Math.round(totProt/n) : 0;
  const avgKcal = n ? Math.round(totKcal/n) : 0;
  const pct = Math.min(100, Math.round(avgProt/178*100));
  document.getElementById('macro-riepilogo').innerHTML = `
    <div class="macro-riga"><span>Media prot/giorno</span><span class="macro-val">${{avgProt}}g</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${{pct}}%"></div></div>
    <div style="font-size:10px;color:var(--muted);margin:2px 0 6px">Target: 178g (${{pct}}%)</div>
    <div class="macro-riga"><span>Media kcal/giorno</span><span class="macro-val">${{avgKcal}}</span></div>
    <div class="macro-riga"><span>Target per pasto</span><span class="macro-val">53g \u00b7 620kcal</span></div>
    <div class="macro-riga"><span>Giorni nel mese</span><span class="macro-val">${{MESI_INFO[meseIdx].num_giorni}}</span></div>`;
}}

// ── SPESA ─────────────────────────────────────────────────────────────────────
function cambiaSettimanaSpesa(delta) {{
  const settimane = SPESE_SETTIMANE[meseIdx][varianteIdx];
  settimanSpesaIdx = Math.max(0, Math.min(settimane.length - 1, settimanSpesaIdx + delta));
  spesaCorrente = settimane[settimanSpesaIdx].spesa;
  renderSpesa();
}}

function renderSpesa() {{
  const settimane = SPESE_SETTIMANE[meseIdx][varianteIdx];
  const sett = settimane[settimanSpesaIdx];
  const lbl = document.getElementById('sett-spesa-label');
  if(lbl) lbl.textContent = sett ? sett.label : '';
  const gruppi = {{}};
  for(const [ingr, v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat] = [];
    gruppi[v.cat].push({{nome:ingr, qta:v.qta}});
  }}
  document.getElementById('spesa-container').innerHTML =
    Object.entries(gruppi).sort().map(([cat, items]) => `
      <div class="spesa-gruppo"><h4>${{cat}}</h4>
        ${{items.map((it,i) => `
          <div class="spesa-item" id="si_${{cat.replace(/[^a-z0-9]/gi,'_')}}_${{i}}">
            <input class="spesa-check" type="checkbox"
              onchange="this.closest('.spesa-item').classList.toggle('checked',this.checked)">
            <label>${{it.nome}}</label><span>${{it.qta}}</span>
          </div>`).join('')}}
      </div>`).join('');
}}

function stampaSpesa() {{
  const settimane = SPESE_SETTIMANE[meseIdx][varianteIdx];
  const sett = settimane[settimanSpesaIdx];
  const gruppi = {{}};
  for(const [ingr, v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat] = [];
    gruppi[v.cat].push('<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:13px"><span>'+ingr+'</span><span style="color:#666">'+v.qta+'</span></div>');
  }}
  const w = window.open('','_blank');
  w.document.write('<html><head><title>Lista Spesa Emanuele</title>'
    +'<style>body{{font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto}}'
    +'h1{{color:#4f7a54;font-size:18px}}h3{{color:#4f7a54;margin:14px 0 4px;border-bottom:1px solid #ddd;padding-bottom:2px;font-size:13px}}'
    +'p{{font-size:11px;color:#888;margin-bottom:12px}}</style></head><body>'
    +'<h1>Lista Spesa \u00b7 Emanuele</h1>'
    +'<p>Settimana: '+(sett ? sett.label : '')+' \u00b7 Variante '+(varianteIdx+1)+'</p>'
    +Object.entries(gruppi).sort().map(([cat,rows]) => '<h3>'+cat+'</h3>'+rows.join('')).join('')
    +'</body></html>');
  w.print();
}}

// ── EMAIL ─────────────────────────────────────────────────────────────────────
function apriModalEmail() {{
  const saved = localStorage.getItem('email_spesa_default') || '';
  document.getElementById('email-input').value = saved;
  document.getElementById('email-default-cb').checked = !!saved;
  document.getElementById('btn-invia-email').disabled = !saved || !saved.includes('@');
  document.getElementById('modal-email').showModal();
}}

function aggiornaEmailUI() {{
  const v = document.getElementById('email-input').value.trim();
  document.getElementById('btn-invia-email').disabled = !v || !v.includes('@');
}}

function toggleDefaultEmail() {{
  const cb = document.getElementById('email-default-cb');
  const v = document.getElementById('email-input').value.trim();
  if(cb.checked && v) localStorage.setItem('email_spesa_default', v);
  else if(!cb.checked) localStorage.removeItem('email_spesa_default');
}}

async function inviaEmail() {{
  const email = document.getElementById('email-input').value.trim();
  if(!email) return;
  if(document.getElementById('email-default-cb').checked)
    localStorage.setItem('email_spesa_default', email);
  const gruppi = {{}};
  for(const [ingr, v] of Object.entries(spesaCorrente)) {{
    if(!gruppi[v.cat]) gruppi[v.cat] = [];
    gruppi[v.cat].push(ingr+': '+v.qta);
  }}
  const sett = SPESE_SETTIMANE[meseIdx][varianteIdx][settimanSpesaIdx];
  const corpo = 'Lista della Spesa - Emanuele - '+(sett ? sett.label : MESI_INFO[meseIdx].nome)+' - Variante '+(varianteIdx+1)+'\\n\\n'
    +Object.entries(gruppi).sort().map(([cat,items]) =>
      cat.toUpperCase()+'\\n'+items.map(i => '  \u2022 '+i).join('\\n')).join('\\n\\n');
  const btn = document.getElementById('btn-invia-email');
  btn.textContent = '\u23f3...'; btn.disabled = true;
  let sent = false;
  if(APPS_SCRIPT_URL) {{
    const r = await sheetsPost({{action:'inviaMailSpesa', email, corpo, mese:MESI_INFO[meseIdx].nome}});
    if(r && r.success) {{ sent = true; setSyncStatus('\u2709\ufe0f Email inviata a '+email); }}
  }}
  if(!sent) {{
    const sub = encodeURIComponent('Lista Spesa Emanuele - '+MESI_INFO[meseIdx].nome);
    window.open('mailto:'+email+'?subject='+sub+'&body='+encodeURIComponent(corpo));
    setSyncStatus('\u2709\ufe0f Aperto client mail');
  }}
  document.getElementById('modal-email').close();
  btn.textContent = '\u2709\ufe0f Invia'; btn.disabled = false;
}}

// ── ARCHIVIO ─────────────────────────────────────────────────────────────────
async function apriArchivio() {{
  document.getElementById('arch-body').innerHTML =
    '<div style="text-align:center;color:var(--muted);padding:20px">Caricamento...</div>';
  document.getElementById('modal-archivio').showModal();
  if(!APPS_SCRIPT_URL) {{
    document.getElementById('arch-body').innerHTML =
      '<div style="color:var(--muted);padding:12px">Sheets non configurato.</div>';
    return;
  }}
  const r = await sheetsGet({{action:'getArchivioMesi'}});
  if(r.error || !r.mesi || r.mesi.length === 0) {{
    document.getElementById('arch-body').innerHTML =
      '<div style="color:var(--muted);padding:12px">'+(r.error || 'Nessun mese salvato.')+'</div>';
    return;
  }}
  document.getElementById('arch-body').innerHTML = r.mesi.map(m =>
    `<div class="arch-item" onclick="caricaMeseArchiviato('${{m.id}}')">
      <div>
        <div class="arch-item-name">${{m.nome}}</div>
        <div class="arch-item-meta">${{m.giorni||'?'}} giorni \u00b7 salvato il ${{m.data_salvataggio||'\u2014'}}</div>
      </div>
      <span>\u2192</span>
    </div>`).join('');
}}

async function caricaMeseArchiviato(id) {{
  document.getElementById('modal-archivio').close();
  setSyncStatus('\u23f3 Caricamento mese archiviato...');
  const r = await sheetsGet({{action:'getPianoMensile', id}});
  if(r.error || !r.piano) {{
    setSyncStatus('\u274c '+(r.error||'nessun piano'));
    return;
  }}
  Object.entries(r.piano).forEach(([iso, row]) => {{
    if(!pianoCorrente[iso]) return;
    if(row.pranzo_proteina && PROTEINE_DB[row.pranzo_proteina]) pianoCorrente[iso].pranzo.proteina = row.pranzo_proteina;
    if(row.pranzo_fecola   && FECULENTI_DB[row.pranzo_fecola])  pianoCorrente[iso].pranzo.fecola   = row.pranzo_fecola;
    if(row.pranzo_grasso   && GRASSI_DB[row.pranzo_grasso])     pianoCorrente[iso].pranzo.grasso   = row.pranzo_grasso;
    if(row.cena_proteina   && PROTEINE_DB[row.cena_proteina])   pianoCorrente[iso].cena.proteina   = row.cena_proteina;
    if(row.cena_fecola     && FECULENTI_DB[row.cena_fecola])    pianoCorrente[iso].cena.fecola     = row.cena_fecola;
    if(row.cena_grasso     && GRASSI_DB[row.cena_grasso])       pianoCorrente[iso].cena.grasso     = row.cena_grasso;
    if(row.eccezione !== undefined) pianoCorrente[iso].eccezione = !!row.eccezione;
    if(row.note_eccezione !== undefined) pianoCorrente[iso].note_eccezione = row.note_eccezione || '';
  }});
  renderCalendario();
  renderMacroRiepilogo();
  setSyncStatus('\u2705 Mese archiviato caricato \u00b7 '+now());
}}

// ── GOOGLE SHEETS ─────────────────────────────────────────────────────────────
function setSyncStatus(msg) {{
  const el = document.getElementById('sync-status');
  if(el) el.textContent = msg;
}}
function now() {{
  return new Date().toLocaleTimeString('it-IT', {{hour:'2-digit', minute:'2-digit'}});
}}

async function salvaMensileSheets() {{
  if(!APPS_SCRIPT_URL) {{ setSyncStatus('\u274c URL Sheets non configurato'); return; }}
  const info = MESI_INFO[meseIdx];
  setSyncStatus('\u23f3 Salvataggio su Sheets...');
  const r = await sheetsPost({{action:'savePianoMensile', piano:pianoCorrente, anno:info.anno, mese:info.mese}});
  if(r && r.success) {{
    setSyncStatus('\u2705 Sheets aggiornato \u00b7 '+now()+' \u00b7 '+(r.giorni||0)+' giorni');
  }} else {{
    setSyncStatus('\u274c '+(r && r.error ? r.error : 'errore sconosciuto'));
  }}
}}

async function sheetsPost(payload) {{
  try {{
    const r = await fetch(APPS_SCRIPT_URL, {{
      method:'POST', redirect:'follow',
      body: JSON.stringify(payload),
      headers: {{'Content-Type':'text/plain'}},
    }});
    return await r.json();
  }} catch(e) {{
    setSyncStatus('\u274c '+e.message);
    return {{error: e.message}};
  }}
}}

async function sheetsGet(params) {{
  const url = new URL(APPS_SCRIPT_URL);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  try {{
    const r = await fetch(url.toString(), {{redirect:'follow'}});
    return await r.json();
  }} catch(e) {{
    return {{error: e.message}};
  }}
}}

// ── INIT ──────────────────────────────────────────────────────────────────────
initAlmanacco();
render();

if(APPS_SCRIPT_URL) {{
  setTimeout(async () => {{
    const info = MESI_INFO[meseIdx];
    setSyncStatus('\u23f3 Caricamento da Sheets...');
    const r = await sheetsGet({{action:'getPianoMensile', anno:info.anno, mese:info.mese}});
    if(r && r.piano && Object.keys(r.piano).length > 0) {{
      Object.entries(r.piano).forEach(([iso, row]) => {{
        if(!pianoCorrente[iso]) return;
        const pr = row.pranzo || {{}};
        const ce = row.cena || {{}};
        if(pr.proteina && PROTEINE_DB[pr.proteina]) pianoCorrente[iso].pranzo.proteina = pr.proteina;
        if(pr.fecola   && FECULENTI_DB[pr.fecola])  pianoCorrente[iso].pranzo.fecola   = pr.fecola;
        if(pr.grasso   && GRASSI_DB[pr.grasso])     pianoCorrente[iso].pranzo.grasso   = pr.grasso;
        if(ce.proteina && PROTEINE_DB[ce.proteina]) pianoCorrente[iso].cena.proteina   = ce.proteina;
        if(ce.fecola   && FECULENTI_DB[ce.fecola])  pianoCorrente[iso].cena.fecola     = ce.fecola;
        if(ce.grasso   && GRASSI_DB[ce.grasso])     pianoCorrente[iso].cena.grasso     = ce.grasso;
        if(row.eccezione !== undefined) pianoCorrente[iso].eccezione = !!row.eccezione;
        if(row.note_eccezione !== undefined) pianoCorrente[iso].note_eccezione = row.note_eccezione || '';
      }});
      renderCalendario();
      renderMacroRiepilogo();
      setSyncStatus('\u2705 Piano caricato da Sheets \u00b7 '+now());
    }} else {{
      setSyncStatus('\\ud83d\\udccb Dati locali (Sheets vuoto)');
    }}
  }}, 1000);
}}
</script>
</body>
</html>"""


def genera_html_mese(piano_corrente, anno, mese):
    def _ser(d): return json.dumps(d, ensure_ascii=False)
    oggi = date.today()
    if mese == 12: anno_p, mese_p = anno+1, 1
    else: anno_p, mese_p = anno, mese+1
    var_corrente = [piano_corrente, genera_mese(anno, mese)]
    var_prossima = [genera_mese(anno_p, mese_p), genera_mese(anno_p, mese_p)]
    spese_corrente = [calcola_spesa(v) for v in var_corrente]
    spese_prossima = [calcola_spesa(v) for v in var_prossima]
    spese_sett_corrente = [calcola_spese_settimane(v, anno, mese) for v in var_corrente]
    spese_sett_prossima = [calcola_spese_settimane(v, anno_p, mese_p) for v in var_prossima]
    mesi_info = [
        {"anno": anno, "mese": mese, "nome": f"{NOME_MESI_IT[mese]} {anno}", "num_giorni": cal_module.monthrange(anno, mese)[1]},
        {"anno": anno_p, "mese": mese_p, "nome": f"{NOME_MESI_IT[mese_p]} {anno_p}", "num_giorni": cal_module.monthrange(anno_p, mese_p)[1]},
    ]
    col_js = {k: {kk: vv for kk, vv in v.items() if kk != "spesa"} for k, v in COLAZIONI.items()}
    return HTML_MESE.format(
        nome_paziente=PAZIENTE["nome"],
        varianti_mesi_json=_ser([var_corrente, var_prossima]),
        mesi_info_json=_ser(mesi_info),
        spese_mesi_json=_ser([spese_corrente, spese_prossima]),
        spese_settimane_json=_ser([spese_sett_corrente, spese_sett_prossima]),
        proteine_json=_ser(PROTEINE),
        feculenti_json=_ser(FECULENTI),
        grassi_json=_ser(GRASSI),
        colazioni_json=_ser(col_js),
        cena_sab_json=_ser(CENA_SAB),
        cena_dom_json=_ser(CENA_DOM),
        apps_script_url=APPS_SCRIPT_URL,
        data_oggi_iso=str(oggi),
    )


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Piano alimentare Emanuele")
    parser.add_argument("--mese", default=None, help="Mese da generare (YYYY-MM)")
    parser.add_argument("--settimana", action="store_true", help="Genera vista settimanale")
    parser.add_argument("--output", default=None)
    args = parser.parse_args()

    oggi = date.today()

    if args.settimana:
        lun = oggi - timedelta(days=oggi.weekday())
        ven = lun + timedelta(4)
        settimana = f"{lun.strftime('%d %b')} – {ven.strftime('%d %b %Y')}"
        print(f"Generazione piano settimana {settimana}...")
        piano = genera_settimana()
        nome_file = args.output or f"piano_emanuele_{lun.strftime('%Y-W%V')}.html"
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), nome_file)
        html = genera_html(piano, settimana)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        spesa = calcola_spesa(piano)
        print(f"Piano settimanale generato: {nome_file}")
        print(f"Lista spesa: {len(spesa)} articoli")
        print(f"Apri: {path}")
        return path, piano, spesa

    if args.mese:
        anno, mese = map(int, args.mese.split("-"))
    else:
        anno, mese = oggi.year, oggi.month

    print(f"Generazione piano {NOME_MESI_IT[mese]} {anno}...")
    piano = genera_mese(anno, mese)

    nome_file = args.output or f"piano_emanuele_{anno}-{mese:02d}.html"
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), nome_file)
    html = genera_html_mese(piano, anno, mese)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)

    _, num_giorni = cal_module.monthrange(anno, mese)
    print(f"Piano generato: {nome_file} ({num_giorni} giorni)")

    spesa = calcola_spesa(piano)
    print(f"Lista spesa: {len(spesa)} articoli")
    print(f"Apri: {path}")
    return path, piano, spesa

if __name__ == "__main__":
    main()
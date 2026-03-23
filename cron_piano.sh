#!/bin/bash
# Piano Alimentare - Cron Script
# Uso: cron_piano.sh [genera|archivia]
# - genera:   genera il piano del mese prossimo (chiamato il 15 di ogni mese)
# - archivia: archivia il mese corrente e apri il nuovo (chiamato il 1 di ogni mese)

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON="python3"
PLANNER="$SCRIPT_DIR/meal_planner.py"
LOG="$SCRIPT_DIR/cron.log"
URL="https://script.google.com/macros/s/AKfycbzOv5MZHXQjV-kG0wWPsIfI1FhH4MnHhLBRFc-GpErR80l-8tF23rA_JUUaJtdL2fWr/exec"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"; }

case "${1:-genera}" in
  genera)
    # Calcola il mese prossimo
    NEXT_MONTH=$(date -d "$(date +%Y-%m-01) +1 month" +%Y-%m)
    log "Generazione piano $NEXT_MONTH..."
    OUTPUT_FILE="piano_emanuele_${NEXT_MONTH}.html"
    $PYTHON "$PLANNER" --mese "$NEXT_MONTH" --output "$SCRIPT_DIR/$OUTPUT_FILE"
    log "Piano generato: $OUTPUT_FILE"
    # Apri nel browser se c'è una sessione grafica
    if [ -n "$DISPLAY" ] || [ -n "$WAYLAND_DISPLAY" ]; then
      xdg-open "$SCRIPT_DIR/$OUTPUT_FILE" 2>/dev/null &
      log "Browser aperto"
    fi
    ;;
  archivia)
    # Archivia mese corrente via Apps Script
    ANNO=$(date +%Y)
    MESE=$(date +%-m)
    log "Archiviazione mese $ANNO-$MESE..."
    RESULT=$($PYTHON -c "
import urllib.request, json
r = urllib.request.urlopen('$URL', data=json.dumps({'action':'archiviaMese','anno':$ANNO,'mese':$MESE}).encode(), timeout=30)
print(r.read().decode())
" 2>&1)
    log "Risposta Sheets: $RESULT"
    # Genera piano del mese corrente per il nuovo mese
    CURRENT_MONTH=$(date +%Y-%m)
    OUTPUT_FILE="piano_emanuele_${CURRENT_MONTH}.html"
    $PYTHON "$PLANNER" --mese "$CURRENT_MONTH" --output "$SCRIPT_DIR/$OUTPUT_FILE"
    log "Nuovo piano mese corrente generato"
    if [ -n "$DISPLAY" ] || [ -n "$WAYLAND_DISPLAY" ]; then
      xdg-open "$SCRIPT_DIR/$OUTPUT_FILE" 2>/dev/null &
    fi
    ;;
  *)
    echo "Uso: $0 [genera|archivia]"
    exit 1
    ;;
esac

log "Done."

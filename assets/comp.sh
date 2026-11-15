#!/bin/bash

InputDir="./raccoon_images"
OutputDir="./raccoon_images_optimized"
MaxBytes=204800 # 200 KB in Bytes

mkdir -p "$OutputDir"

Before=0
After=0
Optimized=0
Unchanged=0
AggressiveOptimized=0

while IFS= read -r -d '' File; do
    Name=$(basename "$File")
    Size=$(stat -c%s "$File")
    Before=$((Before + Size))

    echo "Optimiere: $Name"

    # Prüfen, ob das Bild breiter als 1000px ist (verhindert unnötiges Hochskalieren kleinerer Bilder)
    ResizeArg=""
    if command -v identify &> /dev/null; then
        Width=$(identify -format "%w" "$File" 2>/dev/null)
        if [ -n "$Width" ] && [ "$Width" -gt 1000 ]; then
            ResizeArg="-resize 1000 0"
            echo "  -> Breite ist $Width px (> 1000px), wird auf max. 1000px verkleinert."
        else
            echo "  -> Breite ist <= 1000px ($Width px), Dimensionen bleiben unverändert."
        fi
    fi

    # 1. Durchlauf: -q 70, -m 6 (und ggf. bedingtes Resizing)
    if cwebp -quiet -q 70 -m 6 $ResizeArg "$File" -o "$OutputDir/$Name"; then
        AfterSize=$(stat -c%s "$OutputDir/$Name")

        # Sicherheits-Check: Wenn die optimierte Datei größer/gleich dem Original ist, nimm das Original
        if [ "$AfterSize" -ge "$Size" ]; then
            echo "  -> Hinweis: Optimierte Datei war größer. Original wird beibehalten."
            cp "$File" "$OutputDir/$Name"
            AfterSize=$Size
            Unchanged=$((Unchanged + 1))
        else
            # 2. Durchlauf: Wenn immer noch über 200 KB, stärker komprimieren (-q 50)
            if [ "$AfterSize" -gt "$MaxBytes" ]; then
                echo "  -> Noch über 200 KB ($((AfterSize / 1024)) KiB). Komprimiere stärker (-q 50)..."
                cwebp -quiet -q 50 -m 6 "$OutputDir/$Name" -o "$OutputDir/$Name"
                AfterSize=$(stat -c%s "$OutputDir/$Name")
                AggressiveOptimized=$((AggressiveOptimized + 1))
            fi
            Optimized=$((Optimized + 1))
        fi

        After=$((After + AfterSize))
    else
        echo "FEHLER: $Name"
        rm -f "$OutputDir/$Name"
    fi

done < <(find "$InputDir" -maxdepth 1 -type f -iname '*.webp' -print0)

echo ""
echo "=== Fertig! ==="
echo "Erfolgreich optimiert: $Optimized"
echo "  - Davon extra stark komprimiert (weil > 200 KB): $AggressiveOptimized"
echo "Unverändert übernommen (da Original kleiner): $Unchanged"
echo "Ursprüngliche Größe: $((Before / 1024)) KiB"
echo "Neue Gesamtgröße:   $((After / 1024)) KiB"
echo "Gesamt eingespart:  $(((Before - After) / 1024)) KiB"

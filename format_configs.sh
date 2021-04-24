#! /bin/zsh

for f (app/config/**/*json); do
    g=${f//json/json.old}
    mv $f $g
    python3 -mjson.tool $g > $f || echo "Formatting failed for $f!"
    rm $g
done

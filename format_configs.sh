#! /usr/bin/env zsh

for f (app/config/**/*json); do
    g=${f//json/json.old}
    cp $f $g
    (python3 -mjson.tool $g > $f && rm $g) || \
        (echo "Formatting failed for $f!" && rm $f && mv $g $f)
done

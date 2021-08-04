#! /usr/bin/env zsh

for f (app/config/**/*json); do
    g=${f//json/json.old}
    cp $f $g
    if ! (python3 -mjson.tool $g > $f && rm $g); then
        echo "Formatting failed for $f!"
        rm $f
        mv $g $f
        exit 1
    fi
done

#!/bin/bash

# Usage: ./set_theme.sh theme_stylesheet.scss
#   This hardlinks the theme based on the name of the theme stylesheet.
#   Example: ./set_theme.sh _bauhaus.scss

if [ -f "client/styles/themes/$1" ]; then
    rm -f client/styles/themes/_active.scss
    ln client/styles/themes/$1 client/styles/themes/_active.scss
    echo "$1 has been set as the theme."
else
    echo "$1 does not exist. Create $1 in client/styles/themes/ and try again."
fi


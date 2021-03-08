#!/bin/bash

# Usage: ./set_theme.sh <name of theme directory>
#   This symlinks the theme based on the name of the theme
#   directory.
#   Example: ./set_theme.sh cabin-weekend

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
THEME=$DIR"/client/styles/themes/_"$1".scss"

if [ -f $THEME ]; then
    ln -sf "_"$1".scss" $DIR/client/styles/themes/_active.scss
    echo "${1} has been set as the current theme."
else
    echo "Theme ${1} doesn't exist!"
fi

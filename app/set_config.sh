#!/bin/bash

# Usage: ./set_config.sh <name of config directory>
#   This symlinks the config based on the name of the config
#   directory.
#   Example: ./set_config.sh cabin-weekend

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ -d $DIR/config/$1 ]; then
    rm -f $DIR/config/overrides
    ln -s "$1" $DIR/config/overrides
    echo "${1} has been set as the current config."
else
    echo "Config ${1} doesn't exist!"
fi

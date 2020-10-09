#!/bin/bash

# Usage: ./set_config.sh <name of config directory>
#   This hardlinks the config based on the name of the config
#   directory.
#   Example: ./set_config.sh cabin-weekend

if [ -d config/$1 ]; then
    rm -f config/overrides/*
    ln config/$1/* config/overrides/
    flask create-db
    echo "${1} has been set as the current config."
else
    echo "Config ${1} does exist."
fi

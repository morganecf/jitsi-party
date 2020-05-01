#! /bin/bash

pushd /app

rm db.sqlite
source setup_prod.sh
flask create-db

popd

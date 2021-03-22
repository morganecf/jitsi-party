#! /bin/bash

make webpack

PARTY_CONFIG=`readlink app/config/overrides`
PARTY_CONFIG="${PARTY_CONFIG:-base}"

PARTY_THEME_FILE=`readlink app/client/styles/themes/_active.scss`
PARTY_THEME_FILE="${PARTY_THEME_FILE:-_basic.scss}"
PARTY_THEME="${PARTY_THEME_FILE//\.scss/}"
PARTY_THEME="${PARTY_THEME//_/}"

GIT_COMMIT=`git rev-parse HEAD`

REPO_BASE="cabinweekend/jitsi-party"

docker pull $REPO_BASE-web:latest
docker build --cache-from $REPO_BASE-web:latest -t $REPO_BASE-web app
docker tag $REPO_BASE-web:latest $REPO_BASE-web:$PARTY_CONFIG-$PARTY_THEME-$GIT_COMMIT
docker push $REPO_BASE-web:latest
docker push $REPO_BASE-web:$PARTY_CONFIG-$PARTY_THEME-$GIT_COMMIT

docker pull $REPO_BASE-proxy:latest
docker build --cache-from $REPO_BASE-proxy:latest -t $REPO_BASE-proxy proxy
docker tag $REPO_BASE-proxy:latest $REPO_BASE-proxy:$GIT_COMMIT
docker push $REPO_BASE-proxy:latest
docker push $REPO_BASE-proxy:$GIT_COMMIT

docker pull $REPO_BASE-prosody:latest
docker build --cache-from $REPO_BASE-prosody:latest -t $REPO_BASE-prosody prosody
docker tag $REPO_BASE-prosody:latest $REPO_BASE-prosody:$GIT_COMMIT
docker push $REPO_BASE-prosody:latest
docker push $REPO_BASE-prosody:$GIT_COMMIT

docker pull $REPO_BASE-node:latest
docker build --cache-from $REPO_BASE-node:latest -t $REPO_BASE-node node
docker tag $REPO_BASE-node:latest $REPO_BASE-node:$GIT_COMMIT
docker push $REPO_BASE-node:latest
docker push $REPO_BASE-node:$GIT_COMMIT



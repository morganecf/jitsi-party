#! /bin/bash


SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

pushd "$SCRIPT_DIR"

DOCKER_REPO="docker.gbre.org/jitsi-party"

QUERY='{ repository(owner: \"morganecf\", name: \"jitsi-party\") { releases(last: 1, orderBy: {field: CREATED_AT, direction: ASC}) {edges { node { tagName }}}}}'

pushd app/client

npm install
node_modules/.bin/webpack
rm -rf node_modules

popd

docker build app/ --tag "$DOCKER_REPO":latest
docker push "$DOCKER_REPO":latest

popd

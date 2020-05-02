#! /bin/bash


SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

pushd "$SCRIPT_DIR"

DOCKER_REPO="docker.gbre.org/jitsi-party"

QUERY='{ repository(owner: \"morganecf\", name: \"jitsi-party\") { releases(last: 1, orderBy: {field: CREATED_AT, direction: ASC}) {edges { node { tagName }}}}}'

TAG=$(curl -H "Authorization: bearer $JITSI_PARTY_GITHUB_TOKEN" -X POST -d "{ \"query\": \"$QUERY\" }" https://api.github.com/graphql 2>/dev/null | jq '.data.repository.releases.edges[].node.tagName')
TAG=${TAG//\"}

OLD_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git fetch upstream
git checkout "$TAG"

pushd app/client

npm install
node_modules/.bin/webpack
rm -rf node_modules

popd

docker build . --tag "$DOCKER_REPO":"$TAG"
docker build . --tag "$DOCKER_REPO":latest

docker push "$DOCKER_REPO":"$TAG"
docker push "$DOCKER_REPO":latest

git checkout "$OLD_BRANCH"

popd

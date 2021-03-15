FROM node:14.16.0-buster-slim

WORKDIR /
COPY ./app/client/package.json package.json
COPY ./app/client/package-lock.json package-lock.json
RUN ["npm", "install"]

VOLUME /app
WORKDIR /app/client

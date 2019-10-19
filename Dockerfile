FROM node:12.11-alpine
RUN apk add --no-cache bash

WORKDIR /www/app

COPY . ./

RUN yarn

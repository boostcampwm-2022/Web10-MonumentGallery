FROM node:latest
RUN mkdir /usr/app
WORKDIR /usr/app
ADD . /usr/app
RUN npm i
ENTRYPOINT node index.js
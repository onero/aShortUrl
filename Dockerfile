FROM node:11-alpine

WORKDIR /express-app

COPY package.json .

RUN npm install --quiet

RUN npm install nodemon -g --quiet

EXPOSE 1337

CMD nodemon -L --watch . src/server.js
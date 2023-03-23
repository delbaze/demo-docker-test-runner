FROM node:lts-alpine

RUN mkdir app
WORKDIR /app

COPY package.json ./
COPY .env ./
RUN npm install

COPY tsconfig.json ./
COPY ./src ./src

CMD npm start
FROM node:iron

WORKDIR /app

COPY package*.json ./
COPY ecosystem.config.js ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "start:dev" ]
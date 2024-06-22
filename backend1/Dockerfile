FROM node:16

WORKDIR /src/app

RUN npm i -g npm@8.19.2

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4024

CMD ["npm", "start"]

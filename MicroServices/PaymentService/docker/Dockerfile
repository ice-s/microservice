FROM node:12.18.3

WORKDIR /build

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json

RUN npm install -g nodemon

RUN npm cache clean --force && npm install

COPY ./src /build/src

CMD ["nodemon", "/build/src/index.js"]
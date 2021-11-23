FROM node:12.18.3

WORKDIR /usr/src/app

COPY ./src/package.json package.json
COPY ./src/package-lock.json package-lock.json

RUN npm install -g nodemon

RUN npm install

COPY ./src .

EXPOSE  3000

#CMD [ "npm", "run", "start" ]
#CMD [ "node", "index.js" ]
CMD ["nodemon", "/usr/src/app/index.js"]
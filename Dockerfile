FROM node:8

WORKDIR /home/node/jazz-ui

COPY . /home/node/jazz-ui

ARG NPM_TOKEN

RUN npm install --force

RUN npm -g add pm2

RUN rm .npmrc

RUN npm run build-test && node shell/copy_server.js

CMD ["npm", "run", "release:docker"]

FROM node:8

WORKDIR /home/node/jazz-ui

COPY . /home/node/jazz-ui

ARG NPM_TOKEN

RUN yarn --force

RUN rm .npmrc

RUN yarn global add pm2

RUN npm run build-test && node shell/copy_server.js

CMD ["npm", "run", "release:docker"]

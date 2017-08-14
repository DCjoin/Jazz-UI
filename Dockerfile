FROM node

WORKDIR /home/node/jazz-ui

COPY . /home/node/jazz-ui

RUN yarn --force

RUN yarn global add pm2

RUN npm run build-test && node shell/copy_server.js

CMD ["node", "./build/release_server.js"]

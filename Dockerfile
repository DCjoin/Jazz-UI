FROM node

WORKDIR /home/node/jazz-ui

COPY . /home/node/jazz-ui

RUN yarn --force

RUN yarn global add pm2

CMD ["npm", "run", "release:docker"]

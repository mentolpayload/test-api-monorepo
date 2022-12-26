FROM node:lts-alpine

RUN apk update && apk add bash && apk add --no-cache coreutils

RUN npm i -g @nestjs/cli typescript ts-node env-cmd

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY ./startup.dev.sh /usr/local/bin/startup.dev.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/startup.dev.sh
RUN sed -i 's/\r//g' /usr/local/bin/wait-for-it.sh
RUN sed -i 's/\r//g' /usr/local/bin/startup.dev.sh

WORKDIR /usr/src/app
RUN npm run build

EXPOSE 8888
CMD ["/usr/local/bin/startup.dev.sh"]

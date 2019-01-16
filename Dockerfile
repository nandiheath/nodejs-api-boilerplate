FROM node:10.11-alpine

# Install git and openssh tools
RUN apk apk update && \
        apk upgrade && \
        apk add openssh-client git && \
        apk --no-cache add --virtual builds-deps build-base python

# Install app dependencies
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN npm install -g pm2

# Create app directory

RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
RUN mkdir -p /opt/app/logs
WORKDIR /opt/app


# Bundle app source
COPY ./src /opt/app/src
COPY server.config.js /opt/app


CMD [ "pm2-docker", "start" , "server.config.js"]

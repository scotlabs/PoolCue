### Base Container
FROM alpine:latest

### Update base and Install node
RUN apk -qq update && apk -qq upgrade
RUN apk -qq add nodejs

### Install git - Required for some bower installs
RUN apk -qq add bash git openssh

### Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

### Install app dependencies
ADD package.json /usr/src/app/
RUN cd /usr/src/app/ && npm install

### Install UI dependencies
RUN npm install -g bower
ADD bower.json /usr/src/app/
RUN cd /usr/src/app/ 
RUN bower install --allow-root

### Bundle app source
COPY . /usr/src/app

### Set node env to Production
ARG NODE=production
ENV NODE_ENV ${NODE}

### Env Variables

### Run with forever!
RUN npm install forever -g
CMD [ "forever", "server.js" ]

# Commands to build & run
# docker build -t pool-cue .
# docker run -d pool-cue
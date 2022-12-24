FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY authServer authServer/
COPY bot bot/
COPY package*.json .
COPY config.json .
COPY ecosystem.config.js .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --only=production
RUN npm install pm2 -g

#Expose Ports
EXPOSE 8888

RUN ls -al -R

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
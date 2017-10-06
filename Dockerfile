FROM hypriot/rpi-node:latest
MAINTAINER Jan Philip Schellenberg <jps@Lumi.education>

# Adding source files into container
ADD . /srv

# Define working directory
WORKDIR /srv

# Install app dependencies & build
RUN npm install --production
RUN npm run build:server

# Open Port 3000
EXPOSE 3000

# Run Node.js
CMD ["node", "build/index.js"]

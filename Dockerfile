FROM arm32v7/node:8.6.0

COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /srv && cp -a /tmp/node_modules /srv

ARG VERSION

WORKDIR /srv
ADD . /srv
RUN ln -s ../lib node_modules/lib
RUN npm run build:server
# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["node", "build/server/boot.js"]
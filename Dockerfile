FROM arm32v7/node:8.6.0

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /srv && cp -a /tmp/node_modules /srv

ARG VERSION

WORKDIR /srv
ADD . /srv
RUN NODE_ENV=production VERSION=$VERSION ./node_modules/.bin/webpack --config './config/webpack.config.prod.js' --progress --colors
RUN ./node_modules/.bin/tsc --project tsconfig.server.json
# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["node", "build/src/server/boot.js"]
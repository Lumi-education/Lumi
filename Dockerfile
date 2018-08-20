FROM arm32v7/node:8.6.0

ARG VERSION

WORKDIR /srv
ADD . /srv
RUN npm install
RUN npm run build
# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["node", "build/src/server/boot.js"]
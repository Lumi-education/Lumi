FROM arm32v7/node:8.6.0

RUN apt-get update --fix-missing && apt-get install -y \
    sshpass \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


ARG VERSION

WORKDIR /srv
ADD . /srv
RUN npm install
RUN npm run build
# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["node", "build/src/server/boot.js"]
FROM arm32v7/node:8.6.0

# Adding source files into container
ADD . /srv

# Define working directory
WORKDIR /srv

# Install app dependencies & build
RUN npm install
RUN npm run build

# Open Port 80
EXPOSE 80
EXPOSE 8081

# Run Node.js
CMD ["node", "build/server/boot.js"]
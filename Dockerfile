FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY app .

EXPOSE 80 443
CMD [ "node", "index.js" ]
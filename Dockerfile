FROM node:14
WORKDIR /smart_light_app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]  

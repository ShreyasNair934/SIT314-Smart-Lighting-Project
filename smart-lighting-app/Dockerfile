FROM node:20.5.1
WORKDIR /smart_light_app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]

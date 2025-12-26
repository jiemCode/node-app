FROM node:lts-alpine3.23

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js .

EXPOSE 3000
CMD ["npm", "start"]

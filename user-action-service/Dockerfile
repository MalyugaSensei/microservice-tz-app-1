FROM node:20-alpine
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
USER node
COPY package*.json .
RUN npm ci
COPY . .
CMD [ "sh", "-c", "npx sequelize-cli db:migrate && npm run start:dev:test" ]
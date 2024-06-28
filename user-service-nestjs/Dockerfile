FROM node:20-alpine
RUN mkdir -p /usr/src/app && chown -R node /usr/src/app
WORKDIR /usr/src/app
USER node
COPY --chown=node:node package*.json .
RUN npm ci
COPY --chown=node:node . .
#RUN npm run build
#CMD [ "node", "dist/main.js" ]
CMD ["npm", "run", "start"]
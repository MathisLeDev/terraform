FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --only=production

COPY . .

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

# Commande de démarrage
CMD ["npm", "start"]
FROM node:18-alpine
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install
RUN npm install -g prisma

COPY . .

RUN npm run build
RUN npm run prod:prisma:generate

EXPOSE 3000


CMD ["sh", "-c", "npm run prod:prisma:push && npm run prod:start"]

FROM node:18-alpine
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install
RUN npm install -g prisma

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000


CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]

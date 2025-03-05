FROM node:18-alpine
WORKDIR /app/client

COPY package*.json ./

# Install dependencies 
RUN npm install 

# Copy the rest of the application code 
COPY . . 

# Build the application 
RUN npm run build 

# Install a lightweight web server 
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "4000"]
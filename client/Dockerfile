FROM node:20-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci
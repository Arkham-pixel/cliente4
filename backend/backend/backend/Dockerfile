# Etapa de construcción
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-slim
WORKDIR /app
COPY --from=build /app /app
RUN npm install --production
EXPOSE 8080
CMD ["node", "index.js"]

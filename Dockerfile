# Usa una imagen base de Node.js
FROM node:18-alpine

# Configura Puppeteer para evitar descargas automáticas
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Instala Chromium y dependencias necesarias
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de tu aplicación
COPY . .

# Expone el puerto en el que tu aplicación escucha
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["node", "index.js"]

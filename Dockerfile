# Koristi službeni Node.js image
FROM node:20

# Postavi radni direktorijum unutar kontejnera
WORKDIR /app

# Kopiraj package.json i package-lock.json
COPY package*.json ./

# Instaliraj zavisnosti
RUN rm -rf node_modules package-lock.json
RUN npm install --build-from-source
# Kopiraj sve fajlove u kontejner
COPY . .

# Izloženi port (ako je tvoj API na portu 3000)
EXPOSE 3000

# Pokreni aplikaciju
CMD ["npm", "start"]

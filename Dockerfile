FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose HF Space default port
EXPOSE 7860

CMD ["npm", "start"]

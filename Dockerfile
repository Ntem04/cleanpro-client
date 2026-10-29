# ─── Étape 1 : Build de l'application React Vite ─────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
RUN npm install

# Copie de l'ensemble des sources du frontend
COPY . .

# Build de production
ENV NODE_ENV=production
ENV VITE_API_URL=/api
RUN npm run build

# ─── Étape 2 : Image d'exécution Nginx minimale et durcie ────────────────────
FROM nginx:alpine

# Suppression de la page d'accueil par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie de la configuration Nginx optimisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des assets compilés depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

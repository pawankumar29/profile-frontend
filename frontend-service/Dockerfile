# Build stage
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_PROFILE_BACKEND_URL
ENV VITE_PROFILE_BACKEND_URL=${VITE_PROFILE_BACKEND_URL}

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

# Replace default nginx config to enable SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

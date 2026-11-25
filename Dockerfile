# syntax=docker/dockerfile:1

FROM node:22-alpine
WORKDIR /app
COPY . .
RUN cd /app
RUN npm install
RUN npm run build
CMD ["node", "./dist/server/entry.mjs"]
EXPOSE 4321
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache netcat-openbsd
ENV NODE_ENV production
COPY --from=builder /app/package.json ./package.json
RUN npm install --production --omit=dev

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next 



USER node

EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0"]
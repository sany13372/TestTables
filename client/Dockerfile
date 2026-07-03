FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV VITE_API_URL=/api
ENV VITE_API_PROXY_TARGET=http://server:3000
ENV VITE_PORT=5173

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]

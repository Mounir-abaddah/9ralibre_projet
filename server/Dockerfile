FROM node:22-alpine

RUN npm install -g pnpm@10.33.2

WORKDIR /home/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set ignore-scripts false

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["node","index.js"]
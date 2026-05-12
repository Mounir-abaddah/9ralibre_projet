FROM node:22-alpine


WORKDIR /home/app


RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

EXPOSE 5173

COPY . .

CMD [ "pnpm","run","dev" ]
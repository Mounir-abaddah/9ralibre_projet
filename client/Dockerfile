FROM node:22

WORKDIR /home/app

RUN npm install -g pnpm@10.33.2

RUN groupadd -r mounir && useradd -g mounir mounir

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN chown -R mounir:mounir /home/app

USER mounir

CMD ["pnpm","run","dev"]
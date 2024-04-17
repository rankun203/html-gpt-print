from node:lts-alpine

WORKDIR /app
ADD package.json pnpm-lock.yaml /app/

RUN npm i -g pnpm && pnpm install && npx puppeteer browsers install chrome

ADD . /app

EXPOSE 3000

CMD ["pnpm", "start"]


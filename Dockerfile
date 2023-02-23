# build stage
FROM node:18 as build-stage

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src ./src
COPY docs ./docs
COPY templates ./templates

RUN pnpm build
RUN pnpm generate:doc

# RUN pnpm prune --prod

# production stage
FROM node:18-alpine as production-stage

WORKDIR /usr/src/app

COPY --from=build-stage /app/package.json /usr/src/app
COPY --from=build-stage /app/node_modules /usr/src/app/node_modules
COPY --from=build-stage /app/dist /usr/src/app/dist
COPY --from=build-stage /app/src /usr/src/app/src
COPY --from=build-stage /app/templates /usr/src/app/templates
COPY --from=build-stage /app/_build /usr/src/app/_build

EXPOSE 3000

# Use node version 16.15.0
FROM node:16.16.0@sha256:2e1b4542d4a06e0e0442dc38af1f4828760aecc9db2b95e7df87f573640d98cd AS dependencies

LABEL maintainer="Heebin Lee <hlee246@myseneca.ca>"
LABEL description="Fragments UI testing web app"

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

ENV NODE_ENV=production

WORKDIR /app

# copy dep files
COPY package.json package-lock.json ./

RUN npm ci --only=production

#########################################################
FROM node:16.16.0-bullseye@sha256:2e1b4542d4a06e0e0442dc38af1f4828760aecc9db2b95e7df87f573640d98cd AS builder

WORKDIR /app

COPY --from=dependencies /app /app/

COPY . .

CMD npm run build
#########################################################
FROM nginx:stable-alpine@sha256:0a88a14a264f46562e2d1f318fbf0606bc87e72727528b51613a5e96f483a0f6 AS deploy

COPY --from=builder /app/src/index.html /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=30s --start-period=5s --retries=3 \
CMD curl --fail localhost:1234 || exit 1
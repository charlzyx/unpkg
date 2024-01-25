ARG NODE_VERSION=16
# https://stackoverflow.com/questions/76109982/installing-specific-version-of-nodejs-and-npm-on-alpine-docker-image
FROM node:${NODE_VERSION}-alpine as node
FROM oven/bun:alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add bash shadow git

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

WORKDIR /build

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# RUN git clone https://github.com/renxia/unpkg.git
COPY ./ ./
RUN bun i
ENV NODE_ENV=production
RUN bun run build  && bun i --production

ENTRYPOINT ["./unpkg.sh"] 

EXPOSE 6789

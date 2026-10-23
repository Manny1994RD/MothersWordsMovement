FROM node:22-alpine
ENV NODE_ENV=production \
    NODE_NO_WARNINGS=1 \
    PORT=8080 \
    DATA_DIR=/data
WORKDIR /app
COPY package.json server.js badges.js seed-checklist.json seed-words.json ./
COPY public ./public
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 8080
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/api/info >/dev/null || exit 1
CMD ["node", "server.js"]

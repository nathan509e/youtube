# --- Build stage: compile TypeScript ---
FROM node:20-bookworm-slim AS build

# python3 is required by yt-dlp-exec's preinstall check, which specifically
# looks for a `python` binary on PATH (Debian only ships `python3`)
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 ca-certificates \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Runtime stage ---
FROM node:20-bookworm-slim

# ffmpeg merges the separate video+audio DASH streams (needed for 1440p/4K)
# python3 is required by yt-dlp itself at runtime (and by yt-dlp-exec's preinstall,
# which looks for a `python` binary specifically)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg python3 ca-certificates \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/server.js"]

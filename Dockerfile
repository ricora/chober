FROM ubuntu:24.04 AS base
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    openssl \
    ca-certificates \
    sqlite3 \
    sqlite3-tools \
    && rm -rf /var/lib/apt/lists/* \
    && curl -L https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz -o /tmp/litestream.tar.gz \
    && tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz \
    && rm /tmp/litestream.tar.gz
USER appuser
WORKDIR /home/appuser
ENV MISE_ROOT="/home/appuser/.local/share/mise"
ENV PATH="/home/appuser/.local/bin:${MISE_ROOT}/shims:${MISE_ROOT}/bin:${PATH}"
RUN curl https://mise.run | bash && \
    echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
WORKDIR /app
COPY --chown=appuser:appuser .tool-versions ./
RUN . ~/.bashrc && mise install

FROM base AS prod-deps
WORKDIR /app
USER root
RUN mkdir /app/node_modules && chown -R appuser:appuser /app
USER appuser
COPY --chown=appuser:appuser package.json bun.lockb ./
COPY --chown=appuser:appuser prisma ./prisma
RUN bun install --frozen-lockfile --production && \
    bun prisma generate
USER root
RUN mkdir -p /tmp/prod-deps && \
    cp -r node_modules /tmp/prod-deps/ && \
    chown -R 65532:65532 /tmp/prod-deps

FROM base AS deps
WORKDIR /app
USER root
RUN mkdir /app/node_modules && chown -R appuser:appuser /app
USER appuser
COPY --chown=appuser:appuser package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM deps AS builder
WORKDIR /app
USER appuser
COPY --chown=appuser:appuser . .
ENV DATABASE_URL=file:/app/db/deploy.db
RUN mkdir -p db && \
    touch db/deploy.db && \
    bun prisma migrate deploy && \
    bun run build
USER root
RUN mkdir -p /tmp/prod/app && \
    cp -r build /tmp/prod/app/ && \
    cp -r prisma /tmp/prod/app/ && \
    cp -r db /tmp/prod/app/ && \
    cp package.json /tmp/prod/app/ && \
    chown -R 65532:65532 /tmp/prod && \
    chmod -R 755 /tmp/prod/app && \
    chmod 666 /tmp/prod/app/db/deploy.db

FROM node:20-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    ca-certificates \
    gettext-base \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/db && \
    chown -R node:node /app
COPY --from=base /usr/local/bin/litestream /usr/local/bin/
COPY litestream.yml.template /etc/litestream.yml.template
COPY run.sh /run.sh
RUN chmod +x /run.sh && \
    chown -R node:node /etc/litestream.yml.template
COPY --from=prod-deps /tmp/prod-deps/node_modules ./node_modules
COPY --from=builder /tmp/prod/app ./
ENV NODE_ENV=production \
    DATABASE_URL=file:/app/db/deploy.db
RUN chown -R node:node /app && \
    chmod 755 /app/db && \
    chmod 666 /app/db/deploy.db
USER node
EXPOSE 3000
ENTRYPOINT ["/run.sh"]

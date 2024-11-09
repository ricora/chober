FROM ubuntu:24.04 AS base
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN groupadd -r appuser && useradd -r -g appuser -s /bin/false appuser
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl=8.5.0-2ubuntu10.4 \
    unzip=6.0-28ubuntu4.1 \
    openssl=3.0.13-0ubuntu3.4 \
    ca-certificates=20240203 \
    && rm -rf /var/lib/apt/lists/*
USER appuser
WORKDIR /home/appuser
ENV MISE_ROOT="/home/appuser/.local/share/mise"
ENV PATH="/home/appuser/.local/bin:${MISE_ROOT}/shims:${MISE_ROOT}/bin:${PATH}"
RUN curl https://mise.run | bash && \
    echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
WORKDIR /app
COPY --chown=appuser:appuser .tool-versions ./
RUN . ~/.bashrc && mise install

FROM base AS builder
WORKDIR /app
USER root
RUN mkdir /app/node_modules && chown -R appuser:appuser /app
USER appuser
COPY --chown=appuser:appuser package.json bun.lockb ./
RUN bun install --frozen-lockfile --verbose
COPY --chown=appuser:appuser . .
RUN bun prisma generate
ENV DATABASE_URL=file:/app/prisma/data/deploy.db
RUN mkdir -p prisma/data && \
    touch prisma/data/deploy.db && \
    bun prisma migrate deploy
RUN bun run build
USER root
RUN bun install --frozen-lockfile --production && \
    mkdir -p /tmp/prod/app && \
    cp -r build /tmp/prod/app/ && \
    cp -r node_modules /tmp/prod/app/ && \
    cp -r prisma /tmp/prod/app/ && \
    cp package.json /tmp/prod/app/ && \
    chown -R 65532:65532 /tmp/prod && \
    chmod -R 755 /tmp/prod/app && \
    chmod 777 /tmp/prod/app/prisma/data && \
    touch /tmp/prod/app/prisma/data/deploy.db && \
    chmod 666 /tmp/prod/app/prisma/data/deploy.db

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
COPY --from=builder /tmp/prod/app ./
ENV NODE_ENV=production \
    DATABASE_URL=file:/app/prisma/data/deploy.db
USER 65532:65532
EXPOSE 3000
CMD ["node_modules/@remix-run/serve/dist/cli.js", "build/server/index.js"]

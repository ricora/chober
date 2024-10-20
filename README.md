# Order

## 目的

ジャズ研が学祭で使用するアプリケーションの作成

## セットアップの方法

1. リポジトリをクローン
   ```bash
   git clone https://github.com/ricora/order.git

2. dependenciesのインストール
   ```bash
   bun install

## DBのセットアップ

1. .envに以下を記述
   ```bash
   DATABASE_URL="file:./dev.db"

2. Prisma Clientを生成
   ```bash
   bun prisma generate

## 開発サーバーの起動方法
   ```bash
   bun run dev
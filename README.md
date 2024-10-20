# Order

## 目的

ジャズ研が学祭で使用するアプリケーションの作成

## セットアップの方法

1. リポジトリをクローン
   ```sh
   git clone https://github.com/ricora/order.git
   ```

2. dependenciesのインストール
   ```sh
   bun install
   ```

## DBのセットアップ

1. .envに以下を記述
   ```sh
   DATABASE_URL="file:./dev.db"
   ```

2. Prisma Clientを生成
   ```sh
   bun prisma generate
   ```

## 開発サーバーの起動方法
   ```sh
   bun run dev
   ```
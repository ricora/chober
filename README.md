# Order

## 目的

ジャズ研が学祭で使用するアプリケーションの作成

## セットアップの方法

1. リポジトリをクローンする。

   ```sh
   git clone https://github.com/ricora/order.git
   ```

2. dependenciesをインストールする。
   ```sh
   bun install
   ```

## DBのセットアップ

1. `.env`に以下を記述する。

   ```sh
   DATABASE_URL="file:./dev.db"
   ```

2. マイグレーションをデータベースに適用する。

   ```sh
   bun prisma migrate dev
   ```

3. Prisma Clientを生成する。
   ```sh
   bun prisma generate
   ```

## 開発サーバーの起動方法

```sh
bun run dev
```

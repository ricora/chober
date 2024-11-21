<div align="center">
  <img alt="" src="./static/icon.svg" width="128" height="128">
  <h1>Chober</h1>
  <p>Chober (帳場 + order + cyber) is an order management web application for food stalls at school festivals.</p>
</div>

## 開発環境のセットアップ

リポジトリをクローンする。

```sh
git clone https://github.com/ricora/order.git
```

### 依存関係のインストール

```sh
bun install --frozen-lockfile
```

### DBのセットアップ

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

### 開発サーバーの起動方法

```sh
bun run dev
```

## 関連ドキュメント

- [アーキテクチャの概要](ARCHITECTURE.md)

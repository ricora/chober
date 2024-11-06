import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import * as Remix from '@remix-run/react'  // Remixライブラリのモック化

// モックデータを作成
const mockDetails = [
  { product_id: 1, quantity: 5 },
  { product_id: 2, quantity: 10 },
]

const mockProducts = [
  { product_id: 1, product_name: 'Product 1', price: 100 },
  { product_id: 2, product_name: 'Product 2', price: 200 },
]

// RemixのuseLoaderDataをモックする
vi.spyOn(Remix, 'useLoaderData').mockReturnValue({
  details: mockDetails,
  products: mockProducts,
})

// テストの例
describe('Home Component', () => {
  it('calculates total profit correctly', () => {
    // コンポーネントをレンダリング
    render()

    // モックデータで計算される総額をチェック
    const totalProfit = mockDetails.reduce(
      (sum, detail) =>
        sum +
        detail.quantity *
          mockProducts
            .filter((product) => detail.product_id === product.product_id)
            .reduce((sum, product) => sum + product.price, 0),
      0,
    )

    // 総額が正しく表示されていることを確認
    expect(screen.getByText(`${totalProfit}円`)).toBeInTheDocument()
  })

  it('renders charts and buttons', () => {
    render()

    // 「総額」やチャートが表示されているかどうかをチェック
    expect(screen.getByText('総額')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /詳細/i })).toBeInTheDocument()
  })
})

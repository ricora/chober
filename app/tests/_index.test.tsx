/// <reference types="vitest" />

import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Home from "app/routes/_index"
import { vi } from "vitest"

// モックデータ
const mockDetails = [
  { product_id: 1, quantity: 10 },
  { product_id: 2, quantity: 5 },
]
const mockProducts = [
  { product_id: 1, product_name: "Product A", price: 100 },
  { product_id: 2, product_name: "Product B", price: 200 },
]

vi.mock("~/crud/crud_details", () => ({
  readDetail: vi.fn(() => Promise.resolve(mockDetails)),
}))
vi.mock("~/crud/crud_products", () => ({
  readProduct: vi.fn(() => Promise.resolve(mockProducts)),
}))

describe("Home Component", () => {
  it("renders without crashing", async () => {
    // コンポーネントを仮想DOMにレンダリング
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    // メインコンテンツが正しく表示されることを確認
    expect(await screen.findByText(/総額/i)).toBeInTheDocument()
    expect(await screen.findByText(/販売数ランキング/i)).toBeInTheDocument()
    expect(await screen.findByText(/売上構成比/i)).toBeInTheDocument()
  })
})

import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi } from "vitest"
import * as crudDetails from "app/crud/crud_details"
import * as crudProducts from "app/crud/crud_products"
import Home from "./_index"

vi.mock("app/crud/crud_details", () => ({
  readDetail: vi.fn(),
}))
vi.mock("app/crud/crud_products", () => ({
  readProduct: vi.fn(),
}))

describe("Home page", () => {
  it("about total profit", async () => {
    const mockDetails: {
      order_detail_id: number
      order_id: number
      product_id: number
      quantity: number
    }[] = [
      { order_detail_id: 1, order_id: 1, product_id: 1, quantity: 3 },
      { order_detail_id: 2, order_id: 2, product_id: 2, quantity: 5 },
    ]

    const mockProducts = [
      { product_id: 1, product_name: "Product_A", price: 100 },
      { product_id: 2, product_name: "Product_B", price: 200 },
    ]

    vi.spyOn(crudDetails, "readDetail").mockResolvedValue(mockDetails)
    vi.spyOn(crudProducts, "readProduct").mockResolvedValue(mockProducts)

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const totalProfit = mockDetails.reduce(
      (sum, detail) =>
        sum +
        detail.quantity *
          mockProducts
            .filter((product) => detail.product_id === product.product_id)
            .reduce((sum, product) => sum + product.price, 0),
      0,
    )

    expect(await screen.findByText(`${totalProfit}`)).toBeInTheDocument()
  })
})

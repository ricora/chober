import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import Home from "~/routes/_index"
import { createMemoryRouter, RouterProvider } from "react-router-dom"

const mockDetails = [
  { order_detail_id: 1, order_id: 1, product_id: 1, quantity: 3 },
  { order_detail_id: 2, order_id: 2, product_id: 2, quantity: 5 },
]
const mockProducts = [
  {
    product_id: 1,
    product_name: "Product_A",
    price: 100,
    stock: 20,
    image: "https://exampleA.com/image.jpg",
    deleted_at: null,
  },
  {
    product_id: 2,
    product_name: "Product_B",
    price: 200,
    stock: 30,
    image: "https://exampleB.com/image.jpg",
    deleted_at: null,
  },
]

const mockLoader = () => {
  return Promise.resolve({
    details: mockDetails,
    products: mockProducts,
  })
}

describe("Home page", () => {
  test("総額が正しく表示されるか", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <Home />,
          loader: mockLoader,
        },
      ],
      { initialEntries: ["/"] },
    )

    render(<RouterProvider router={router} />)
    expect(await screen.findByText("総額")).toBeInTheDocument()
    expect(await screen.findByText("1300")).toBeInTheDocument()
  })
})

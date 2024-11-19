//Productsの操作
import { PrismaClient } from "@prisma/client"
import { TypeProduct } from "~/type/typeproduct"

const prisma = new PrismaClient()

//productの追加
export async function createProduct(data: Omit<TypeProduct, "product_id">) {
  return await prisma.products.create({
    data,
  })
}

//productの読み込み
export async function readProduct({ includeDeleted = false } = {}) {
  return await prisma.products.findMany({
    where: {
      deleted_at: includeDeleted ? undefined : null,
    },
  })
}

//商品の変更
export async function updateProduct(
  product_id: number,
  data: Omit<TypeProduct, "product_id">,
) {
  return await prisma.products.update({
    where: {
      product_id,
    },
    data,
  })
}

//在庫の変更
export async function updateStock(data: {
  product_id: number
  stock: number | undefined
  num: number
}) {
  return await prisma.products.update({
    where: {
      product_id: data.product_id,
    },
    data: { stock: data.stock ? data.stock - data.num : 0 },
  })
}

//同じ商品名の商品が既に存在するか確認する
export async function existProduct(name: string) {
  return await prisma.products.findFirst({
    where: {
      product_name: {
        equals: name,
      },
      deleted_at: {
        equals: null,
      },
    },
  })
}

//すべての商品を消す
export async function deleteAllProducts() {
  await prisma.products.deleteMany()
}

//Productの削除
export async function deleteProduct(product_id: number) {
  console.log("Deleting product with ID:", product_id)

  try {
    const result = await prisma.products.update({
      where: {
        product_id,
      },
      data: {
        deleted_at: new Date(),
      },
    })
    console.log("Product deleted successfully:", result)
    return result
  } catch (error) {
    console.error("Error in deleteProduct:", error) // エラー詳細を出力
    throw error
  }
}

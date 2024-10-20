//Productsの操作
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

//productの追加
export async function createProduct(data: {
  product_name: string
  price: number
}) {
  return await prisma.products.create({
    data: {
      product_name: data.product_name,
      price: data.price,
    },
  })
}

//productの読み込み
export async function readProduct() {
  return await prisma.products.findMany()
}

//商品の変更
export async function updateProduct(
  product_id: number,
  product_name: string,
  price: number,
) {
  return await prisma.products.update({
    where: {
      product_id: product_id,
    },
    data: {
      product_name: product_name,
      price: price,
    },
  })
}

//同じ商品名の商品が既に存在するか確認する
export async function existProduct(name: string) {
  return await prisma.products.findFirst({
    where: {
      product_name: {
        equals: name,
      },
    },
  })
}

//すべての商品を消す
export async function deleteAllProducts() {
  await prisma.products.deleteMany()
}

//Productの削除
// export async function deleteProduct(product_id: number) {
//   console.log("Deleting product with ID:", product_id);
//   return await prisma.products.delete({
//     where: {
//       product_id: product_id,
//     },
//   });
// }
export async function deleteProduct(product_id: number) {
  console.log("Deleting product with ID:", product_id)

  try {
    const result = await prisma.products.delete({
      where: {
        product_id: product_id,
      },
    })
    console.log("Product deleted successfully:", result)
    return result
  } catch (error) {
    console.error("Error in deleteProduct:", error) // エラー詳細を出力
    throw error
  }
}

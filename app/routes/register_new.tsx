import { Heading, VStack } from "@chakra-ui/react"
import { ActionFunctionArgs } from "@remix-run/node"
import { json, useActionData, useLoaderData } from "@remix-run/react"
import { parseWithValibot } from "conform-to-valibot"
import { FC, useEffect } from "react"
import {
  ProductForm,
  productSchema,
} from "~/components/organisms/register/ProductForm"
import { readProduct } from "~/crud/crud_products"

export const loader = async () => {
  const products = await readProduct()
  return json({ products })
}

const Register = () => {
  const { products } = useLoaderData<typeof loader>()

  return (
    <VStack>
      <CreateProductForm />
    </VStack>
  )
}
export default Register

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const product = parseWithValibot(formData, { schema: productSchema })
  if (product.status !== "success") {
    return json(product.reply())
  }
  return json(product.reply({ resetForm: true }))
}

const CreateProductForm: FC = () => {
  const actionData = useActionData<typeof action>()

  return (
    <VStack w="full" maxW="400px" gap="4">
      <Heading fontSize="2xl" alignSelf="start">
        商品登録フォーム
      </Heading>
      <ProductForm submitText="登録" lastResult={actionData} />
    </VStack>
  )
}

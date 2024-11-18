import { Heading, VStack } from "@chakra-ui/react"
import { ActionFunctionArgs } from "@remix-run/node"
import { json, useActionData, useLoaderData } from "@remix-run/react"
import { mergeForm, useForm, useTransform } from "@tanstack/react-form"
import {
  createServerValidate,
  ServerValidateError,
} from "@tanstack/react-form/remix"
import { FC } from "react"
import {
  ProductForm,
  ProductFormValues,
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
  try {
    await serverValidate(formData)
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
  return null
}

const serverValidate = createServerValidate<ProductFormValues>({
  onServerValidate: ({ value }) => {
    if (value.stock < 12) {
      return "Server validation: You must be at least 12 to sign up"
    }
  },
})

const CreateProductForm: FC = () => {
  const actionData = useActionData<typeof action>()
  const form = useForm<ProductFormValues>({
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData],
    ),
  })

  return (
    <VStack w="full" maxW="400px" gap="4">
      <Heading fontSize="2xl" alignSelf="start">
        商品登録フォーム
      </Heading>
      <ProductForm
        form={form}
        submitText="登録"
        submittingText="商品を登録中..."
      />
    </VStack>
  )
}

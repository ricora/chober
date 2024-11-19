import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { ActionFunctionArgs, TypedResponse } from "@remix-run/node"
import { json, useActionData, useLoaderData } from "@remix-run/react"
import { parseWithValibot } from "conform-to-valibot"
import { FC, useEffect, useMemo, useState } from "react"
import { Form } from "~/components/atoms/Form"
import { ProductCard } from "~/components/organisms/register/ProductCard"
import {
  ProductForm,
  createProductSchema,
  updateProductSchema,
} from "~/components/organisms/register/ProductForm"
import {
  createProduct,
  deleteProduct,
  existProduct,
  readProduct,
  updateProduct,
} from "~/crud/crud_products"
import { TypeProduct } from "~/type/typeproduct"
import * as v from "valibot"
import { SubmissionResult } from "@conform-to/react"
import { useMessage } from "~/hooks/useMessage"

export const loader = async () => {
  const products = await readProduct()
  return json({ products })
}

type ActionResponse = {
  method?: string
  success: boolean
  message?: string
  product_id?: number
  result?: SubmissionResult<string[]>
}

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> => {
  if (request.method.toLocaleLowerCase() !== "post") {
    return json(
      { success: false, message: "不正なリクエストです" },
      { status: 400 },
    )
  }

  const formData = await request.formData()
  const method = formData.get("_method")
  switch (method) {
    case "create": {
      const product = parseWithValibot(formData, {
        schema: createProductSchema,
      })
      if (product.status !== "success") {
        return json({
          method: "create",
          success: false,
          result: product.reply(),
        })
      }
      try {
        const isExist = await existProduct(product.value.product_name)
        if (isExist) {
          return json({
            method: "create",
            success: false,
            result: product.reply({
              fieldErrors: {
                product_name: ["同じ名前の商品がすでに存在します"],
              },
            }),
          })
        }
        await createProduct({
          product_name: product.value.product_name,
          price: product.value.price,
          stock: product.value.stock,
          image: product.value.image,
        })
        return json({
          method: "create",
          success: true,
          result: product.reply({ resetForm: true }),
        })
      } catch (error) {
        return databaseErrorResponse("create", error)
      }
    }

    case "update": {
      const product = parseWithValibot(formData, {
        schema: updateProductSchema,
      })
      if (product.status !== "success") {
        return json({
          method: "update",
          success: false,
          result: product.reply(),
        })
      }
      try {
        await updateProduct(product.value.product_id, {
          product_name: product.value.product_name,
          price: product.value.price,
          stock: product.value.stock,
          image: product.value.image,
        })
        return json({
          method: "update",
          success: true,
          result: product.reply({ resetForm: true }),
        })
      } catch (error) {
        return databaseErrorResponse("update", error)
      }
    }

    case "delete": {
      const product = parseWithValibot(formData, {
        schema: deleteProductSchema,
      })

      if (product.status !== "success") {
        return json({
          method: "delete",
          success: false,
          result: product.reply(),
        })
      }
      try {
        await deleteProduct(product.value.product_id)
        return json({
          method: "delete",
          success: true,
          result: product.reply(),
        })
      } catch (error) {
        return databaseErrorResponse("delete", error)
      }
    }
  }

  return json(
    {
      method: method?.toString(),
      success: false,
      message: "不正なリクエストです",
    },
    { status: 400 },
  )
}

const databaseErrorResponse = (method: string, error: unknown) => {
  return json({
    method,
    success: false,
    message:
      typeof error === "object" && error != null && "message" in error
        ? String(error.message)
        : "不明なデータベースエラーが発生しました",
  } satisfies ActionResponse)
}

const Register = () => {
  return (
    <VStack gap={12}>
      <CreateProductForm />
      <Products />
    </VStack>
  )
}
export default Register

const CreateProductForm: FC = () => {
  const actionData = useActionData<typeof action>()
  const lastResult = useLastResult("create", actionData)
  const { showMessage } = useMessage()

  useEffect(() => {
    if (actionData?.method !== "create") return
    if (actionData.success) {
      showMessage({ title: "登録完了", status: "success" })
    } else {
      showMessage({
        title: actionData.message ? actionData.message : "登録失敗",
        status: "error",
      })
    }
  }, [actionData])

  return (
    <VStack
      w="full"
      maxW="400px"
      gap="4"
      bg="white"
      h="fit-content"
      borderRadius="10px"
      shadow="md"
      fontSize="xl"
      p={4}
    >
      <Heading fontSize="2xl" alignSelf="start">
        商品登録フォーム
      </Heading>
      <ProductForm _method="create" submitText="登録" lastResult={lastResult} />
    </VStack>
  )
}

const Products: FC = () => {
  const { products } = useLoaderData<typeof loader>()
  const [isOpen, setOpen] = useState(false)
  const [changeProduct, setChangeProduct] = useState<TypeProduct | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<TypeProduct | null>(null)
  const changeModal = useDisclosure()
  const deleteModal = useDisclosure()

  const onClickChange = (product: TypeProduct) => {
    setChangeProduct(product)
    changeModal.onOpen()
  }

  const onClickDelete = (product: TypeProduct) => {
    setDeleteProduct(product)
    deleteModal.onOpen()
  }

  return (
    <VStack>
      {isOpen ? (
        <Button colorScheme="blue" onClick={() => setOpen(false)}>
          閉じる
        </Button>
      ) : (
        <Button colorScheme="blue" onClick={() => setOpen(true)}>
          商品一覧
        </Button>
      )}
      {isOpen && (
        <>
          <Wrap p={{ base: 4, md: 10 }}>
            {products.map((product) => (
              <WrapItem key={product.product_id} mx="auto">
                <ProductCard
                  product={product}
                  clickDelete={onClickDelete}
                  clickChange={onClickChange}
                />
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
      <ChangeProductModal
        product={changeProduct}
        isOpen={changeModal.isOpen}
        onClose={changeModal.onClose}
      />
      <DeleteProductModal
        product={deleteProduct}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </VStack>
  )
}

const ChangeProductModal: FC<{
  product: TypeProduct | null
  isOpen: boolean
  onClose: () => void
}> = ({ product, isOpen, onClose }) => {
  const actionData = useActionData<typeof action>()
  const lastResult = useLastResult("update", actionData)
  const { showMessage } = useMessage()

  useEffect(() => {
    if (actionData?.method !== "update") return
    if (actionData.success) {
      showMessage({ title: "変更完了", status: "success" })
      onClose()
    } else {
      showMessage({
        title: actionData.message ? actionData.message : "変更失敗",
        status: "error",
      })
    }
  }, [actionData])

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent pb={2}>
        <ModalCloseButton />
        <ModalHeader>商品情報変更</ModalHeader>
        <ModalBody>
          <ProductForm
            _method="update"
            submitText="変更"
            lastResult={lastResult}
            defaultValue={product}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const deleteProductSchema = v.object({
  product_id: v.pipe(
    v.number("製品IDは数字で入力してください"),
    v.integer("製品IDは整数で入力してください"),
    v.minValue(0, "製品IDは0以上で入力してください"),
  ),
})

const DeleteProductModal: FC<{
  product: TypeProduct | null
  isOpen: boolean
  onClose: () => void
}> = ({ product, isOpen, onClose }) => {
  const actionData = useActionData<typeof action>()
  const { showMessage } = useMessage()

  useEffect(() => {
    if (actionData?.method !== "delete") return
    if (actionData.success) {
      showMessage({ title: "削除完了", status: "success" })
      onClose()
    } else {
      showMessage({
        title: actionData.message ? actionData.message : "削除失敗",
        status: "error",
      })
    }
  }, [actionData])

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent pb={2}>
        <ModalCloseButton />
        <ModalHeader>商品削除</ModalHeader>
        <ModalBody mx={4}>
          <Text>{product?.product_name}を本当に削除しますか？</Text>
          <br />
          <Form method="post">
            <Input type="hidden" value="delete" name="_method" />
            <Input
              type="hidden"
              value={product?.product_id}
              name="product_id"
            />
            <Button w="100%" type="submit">
              はい
            </Button>
          </Form>
          <Button w="100%" onClick={onClose}>
            いいえ
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const useLastResult = (
  method: string,
  actionData: ActionResponse | undefined,
) => {
  return useMemo(() => {
    if (
      actionData != null &&
      "method" in actionData &&
      actionData?.method === method
    ) {
      return actionData.result
    }
  }, [actionData])
}

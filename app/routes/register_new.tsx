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
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { ActionFunctionArgs } from "@remix-run/node"
import { json, useActionData, useLoaderData } from "@remix-run/react"
import { parseWithValibot } from "conform-to-valibot"
import { FC, useState } from "react"
import { Form } from "~/components/atoms/Form"
import { ProductCard } from "~/components/organisms/register/ProductCard"
import {
  ProductForm,
  productSchema,
} from "~/components/organisms/register/ProductForm"
import { readProduct } from "~/crud/crud_products"
import { TypeProduct } from "~/type/typeproduct"

export const loader = async () => {
  const products = await readProduct()
  return json({ products })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const product = parseWithValibot(formData, { schema: productSchema })
  if (product.status !== "success") {
    return json(product.reply())
  }
  return json(product.reply({ resetForm: true }))
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
      <ProductForm submitText="登録" lastResult={actionData} />
    </VStack>
  )
}

const Products: FC = () => {
  const { products } = useLoaderData<typeof loader>()
  const [isOpen, setOpen] = useState(false)

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
        <Wrap p={{ base: 4, md: 10 }}>
          {products.map((product) => (
            <WrapItem key={product.product_id} mx="auto">
              <EditableProductCard product={product} />
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  )
}

const EditableProductCard: FC<{
  product: TypeProduct
}> = ({ product }) => {
  const changeModal = useDisclosure()
  const deleteModal = useDisclosure()

  return (
    <>
      <ProductCard
        product={product}
        clickDelete={deleteModal.onOpen}
        clickChange={changeModal.onOpen}
      />
      <ChangeProductModal
        product={product}
        isOpen={changeModal.isOpen}
        onClose={changeModal.onClose}
      />
      <DeleteProductModal
        product={product}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </>
  )
}

const ChangeProductModal: FC<{
  product: TypeProduct
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const actionData = useActionData<typeof action>()

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent pb={2}>
        <ModalCloseButton />
        <ModalHeader>商品情報変更</ModalHeader>
        <ModalBody>
          <ProductForm submitText="変更" lastResult={actionData} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const DeleteProductModal: FC<{
  product: TypeProduct
  isOpen: boolean
  onClose: () => void
}> = ({ product, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent pb={2}>
        <ModalCloseButton />
        <ModalHeader>商品削除</ModalHeader>
        <ModalBody mx={4}>
          <p>{product.product_name}を本当に削除しますか？</p>
          <br />
          <Form method="post">
            <Input type="hidden" name="_method" value="delete" />
            <Input type="hidden" value={product.product_id} name="product_id" />
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

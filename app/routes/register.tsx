import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node"
import { Form, json, useActionData, useLoaderData } from "@remix-run/react"
import React, { useState, useEffect } from "react"
import { ProductCard } from "~/components/organisms/register/ProductCard"
import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  existProduct,
  readProduct,
  updateProduct,
} from "~/crud/crud_products"
import { useMessage } from "~/hooks/useMessage"
import { TypeProduct } from "~/type/typeproduct"

type ActionData = {
  success: boolean
  error?: string
  method?: string
}

export default function Register() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState("")
  const [isLoading, setLoading] = useState(false)
  const actionData = useActionData<ActionData>()
  const { showMessage } = useMessage()
  const { products: products } = useLoaderData<typeof loader>()
  const [isOpen, setOpen] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteAllOpen,
    onOpen: onDeleteAllOpen,
    onClose: onDeleteAllClose,
  } = useDisclosure()
  const {
    isOpen: isChangeOpen,
    onOpen: onChangeOpen,
    onClose: onChangeClose,
  } = useDisclosure()
  const [deleteProduct, setDeleteProduct] = useState<TypeProduct | null>(null)
  const [changeProduct, setChangeProduct] = useState<TypeProduct | null>(null)

  useEffect(() => {
    if (actionData?.success && actionData?.method === "POST") {
      setName("")
      setPrice("")
      setStock("")
      setImage("")
      setLoading(false)
      showMessage({ title: "登録完了", status: "success" })
    }

    if (actionData?.error === "isExist" && actionData?.method === "POST") {
      showMessage({ title: "すでに登録済みです", status: "error" })
    } else if (actionData?.error && actionData?.method === "POST") {
      showMessage({ title: "登録失敗", status: "error" })
    }

    if (actionData?.success && actionData?.method === "delete") {
      showMessage({ title: "削除完了", status: "success" })
      setDeleteProduct(null)
      onDeleteClose()
    }
    if (actionData?.error && actionData?.method === "delete") {
      showMessage({ title: "削除失敗", status: "error" })
    }
    if (actionData?.success && actionData?.method === "update") {
      showMessage({ title: "変更完了", status: "success" })
      setChangeProduct(null)
      onChangeClose()
    }
    if (actionData?.error && actionData?.method === "update") {
      showMessage({ title: "変更失敗", status: "error" })
    }
  }, [actionData, onDeleteClose, onChangeClose, showMessage])

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const priceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
  }

  const stockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value)
  }

  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value)
  }

  const productOpen = () => {
    setOpen(true)
  }

  const productClose = () => {
    setOpen(false)
  }

  const clickDelete = (product: TypeProduct) => {
    setDeleteProduct(product)
    onDeleteOpen()
  }

  const clickDeleteAll = () => {
    onDeleteAllOpen()
  }

  const clickChange = (product: TypeProduct) => {
    setChangeProduct(product)
    onChangeOpen()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changeProduct) {
      setChangeProduct({
        ...changeProduct,
        product_name: e.target.value,
      })
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changeProduct) {
      setChangeProduct({
        ...changeProduct,
        price: Number(e.target.value),
      })
    }
  }

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changeProduct) {
      setChangeProduct({
        ...changeProduct,
        stock: Number(e.target.value),
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changeProduct) {
      setChangeProduct({
        ...changeProduct,
        image: e.target.value,
      })
    }
  }

  return (
    <div>
      <Button
        colorScheme="red"
        onClick={clickDeleteAll}
        position="relative"
        top="-2"
        right="-850"
        mb="4"
      >
        すべて削除
      </Button>
      <VStack>
        <Box
          bg="white"
          w="full"
          maxW="400px"
          h="fit-content"
          borderRadius="10px"
          shadow="md"
          fontSize="xl"
          p={4}
        >
          <Heading mb="4" fontSize="2xl">
            商品登録フォーム
          </Heading>
          <Form method="post">
            <VStack gap="4">
              <FormControl>
                <FormLabel>商品名</FormLabel>
                <Input
                  type="text"
                  name="product_name"
                  value={name}
                  onChange={nameChange}
                  bg="gray.200"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>価格（税込み）</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={price}
                  onChange={priceChange}
                  bg="gray.200"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>在庫</FormLabel>
                <Input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={stockChange}
                  bg="gray.200"
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>商品画像</FormLabel>
                <Input
                  type="url"
                  name="image"
                  value={image}
                  onChange={imageChange}
                  bg="gray.200"
                  required
                />
                <FormHelperText>
                  商品画像は画像URLで入力してください
                </FormHelperText>
              </FormControl>
              <Button
                alignSelf="end"
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
              >
                登録
              </Button>
            </VStack>
          </Form>
        </Box>
        {isOpen ? (
          <Button colorScheme="blue" onClick={productClose}>
            閉じる
          </Button>
        ) : (
          <Button colorScheme="blue" onClick={productOpen}>
            商品一覧
          </Button>
        )}
        {isOpen ? (
          <div>
            <Wrap p={{ base: 4, md: 10 }}>
              {products.map((product) => (
                <WrapItem key={product.product_id} mx="auto">
                  <ProductCard
                    product={product}
                    clickDelete={clickDelete}
                    clickChange={clickChange}
                  />
                </WrapItem>
              ))}
            </Wrap>
          </div>
        ) : null}
      </VStack>
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent pb={2}>
          <ModalBody mx={4}>
            <p>{deleteProduct?.product_name}を本当に削除しますか？</p>
            <br />
            <Form method="post">
              <Input type="hidden" name="_method" value="delete" />
              <Input
                type="hidden"
                value={deleteProduct?.product_id}
                name="product_id"
              />
              <Button w="100%" type="submit">
                はい
              </Button>
            </Form>
            <Button w="100%" onClick={onDeleteClose}>
              いいえ
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteAllOpen}
        onClose={onDeleteAllClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent pb={2}>
          <ModalBody mx={4}>
            <p>本当にすべて削除しますか？</p>
            <br />
            <Form method="post">
              <Input type="hidden" name="_method" value="delete_all" />
              <Button w="100%" type="submit">
                はい
              </Button>
            </Form>
            <Button w="100%" onClick={onDeleteAllClose}>
              いいえ
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isChangeOpen}
        onClose={onChangeClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent pb={2}>
          <ModalCloseButton />
          <ModalHeader />
          <Form method="post">
            <ModalBody mx={4}>
              <Stack spacing={4}>
                <Input type="hidden" name="_method" value="update" />
                <Input
                  type="hidden"
                  value={changeProduct?.product_id}
                  name="product_id"
                />
                <FormControl>
                  <FormLabel>商品名</FormLabel>
                  <Input
                    name="product_name"
                    type="text"
                    value={changeProduct?.product_name}
                    onChange={handleNameChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>価格（税込み）</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={changeProduct?.price}
                    onChange={handlePriceChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>在庫</FormLabel>
                  <Input
                    name="stock"
                    type="number"
                    value={changeProduct?.stock}
                    onChange={handleStockChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>商品画像</FormLabel>
                  <Input
                    type="url"
                    name="image"
                    value={changeProduct?.image}
                    onChange={handleImageChange}
                    required
                  />
                  <FormHelperText>
                    商品画像は画像URLで入力してください
                  </FormHelperText>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter gap={4}>
              <Button type="submit" colorScheme="green">
                更新
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </div>
  )
}

export const loader = async () => {
  const response = await readProduct()
  return json({ products: response })
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const method = formData.get("_method")

  if (
    request.method === "POST" &&
    method !== "delete" &&
    method !== "update" &&
    method !== "delete_all"
  ) {
    const product_name = formData.get("product_name")
    const price = Number(formData.get("price"))
    const stock = Number(formData.get("stock"))
    const image = formData.get("image")

    if (typeof product_name === "string") {
      const isExist = await existProduct(product_name)

      if (isExist) {
        return json({
          success: false,
          error: "isExist",
          method: request.method,
        })
      }
    }

    const isValidInput =
      typeof product_name === "string" &&
      !isNaN(price) &&
      !isNaN(stock) &&
      typeof image === "string" &&
      URL.canParse(image)
    if (isValidInput) {
      await createProduct({
        product_name,
        price,
        stock,
        image,
      })

      return json({ success: true, method: request.method })
    } else {
      return json({
        success: false,
        error: "Invalid input",
        method: request.method,
      })
    }
  } else if (method === "delete") {
    const product_id = Number(formData.get("product_id"))
    console.log("Method:", method)
    console.log("Product ID:", product_id)
    if (!isNaN(product_id)) {
      try {
        await deleteProduct(product_id)
        return json({ success: true, method: method })
      } catch (error) {
        return json({
          success: false,
          error: "Failed to delete product",
          method: method,
        })
      }
    } else {
      return json({
        success: false,
        error: "Invalid product ID",
        method: method,
      })
    }
  } else if (method === "update") {
    const product_id = Number(formData.get("product_id"))
    const product_name = formData.get("product_name")
    const price = Number(formData.get("price"))
    const stock = Number(formData.get("stock"))
    const image = formData.get("image")

    const isValidInput =
      !isNaN(product_id) &&
      typeof product_name === "string" &&
      !isNaN(price) &&
      !isNaN(stock) &&
      typeof image === "string" &&
      URL.canParse(image)
    if (isValidInput) {
      await updateProduct(product_id, {
        product_name,
        price,
        stock,
        image,
      })
      return json({ success: true, method: method })
    } else {
      return json({ success: false, error: "no product_name", method: method })
    }
  } else if (method == "delete_all") {
    await deleteAllProducts()
    return json({ success: true, method: method })
  } else {
    return json({ success: false, error: "Unsupported request method" })
  }
}

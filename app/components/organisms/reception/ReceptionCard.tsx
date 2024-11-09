import { Box, Button, Stack, Text } from "@chakra-ui/react"
import { FC, memo } from "react"
import { TypeProduct } from "~/type/typeproduct"
import PropTypes from "prop-types"

type Props = {
  quantity?: number
  product: TypeProduct
  addOrder: (product: TypeProduct) => void
  cancelOrder: (product: TypeProduct) => void
}

export const ReceptionCard: FC<Props> = memo((props) => {
  const { quantity = 0, product, addOrder, cancelOrder } = props

  return (
    <Box
      w="300px"
      h="250px"
      bg={
        product.stock - quantity === 0
          ? "red"
          : product.stock - quantity <= 10
            ? "red.100"
            : "white"
      }
      borderRadius="10px"
      shadow="md"
      p={4}
    >
      <h1>ID：{product.product_id}</h1>
      <Stack textAlign={"center"}>
        <Text>{product.product_name}</Text>
        <Text>価格：{product.price}</Text>
        <Text>在庫：{product.stock - quantity}</Text>
        <Button
          isDisabled={
            quantity ? product.stock - quantity <= 0 : product.stock <= 0
          }
          onClick={() => addOrder(product)}
          colorScheme="blue"
        >
          +
        </Button>
        <Button onClick={() => cancelOrder(product)} colorScheme="red">
          -
        </Button>
      </Stack>
    </Box>
  )
})

ReceptionCard.displayName = "ReceptionCard"

ReceptionCard.propTypes = {
  product: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    product_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  addOrder: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
}

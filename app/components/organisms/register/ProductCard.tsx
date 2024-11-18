import { Box, Button, Stack, Text } from "@chakra-ui/react"
import { FC, memo } from "react"
import { TypeProduct } from "~/type/typeproduct"
import PropTypes from "prop-types"

type Props = {
  product: TypeProduct
  clickDelete: (product: TypeProduct) => void
  clickChange: (product: TypeProduct) => void
}

export const ProductCard: FC<Props> = memo((props) => {
  const { product, clickDelete, clickChange } = props

  return (
    <Box
      w="full"
      maxW="300px"
      h="fit-content"
      bg={"white"}
      borderRadius="10px"
      shadow="md"
      p={4}
    >
      <h1>ID：{product.product_id}</h1>
      <Stack textAlign={"center"}>
        <Text>{product.product_name}</Text>
        <Text>価格：{product.price}</Text>
        <Text>在庫：{product.stock}</Text>
        <img src={product.image} alt={`${product.product_name}の商品画像`} />
        <Button onClick={() => clickDelete(product)} colorScheme="red">
          削除
        </Button>
        <Button onClick={() => clickChange(product)} colorScheme="green">
          変更
        </Button>
      </Stack>
    </Box>
  )
})

ProductCard.displayName = "ProductCard"

ProductCard.propTypes = {
  product: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    product_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  clickDelete: PropTypes.func.isRequired,
  clickChange: PropTypes.func.isRequired,
}

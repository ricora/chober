import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { json, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { readDetail } from "~/crud/crud_details"
import { readProduct } from "~/crud/crud_products"

export default function Home() {
  const { details: details, products: products } =
    useLoaderData<typeof loader>()
  const [loadTime, setLoadTime] = useState<Date | null>(null)

  const totalProfit = details.reduce(
    (sum, detail) =>
      sum +
      detail.quantity *
        products
          .filter((product) => detail.product_id === product.product_id)
          .reduce((sum, product) => sum + product.price, 0),
    0,
  )

  useEffect(() => {
    const time: Date = new Date()
    setLoadTime(time)
  }, [])

  return (
    <VStack>
      <Box
        w={{ md: "100%", lg: "975px" }}
        h="280px"
        bg="white"
        borderRadius="10px"
        shadow="md"
        p={4}
      >
        <VStack>
          <HStack alignItems="baseline">
            <Text fontSize="3xl">総額</Text>
            <Text
              color="red"
              fontFamily="'Playfair Display', serif"
              fontSize="8xl"
              fontStyle="italic"
            >
              {totalProfit}
            </Text>
            <Text fontSize="3xl">円</Text>
          </HStack>
          <Text fontSize="3xl">
            の売り上げ（
            {loadTime ? loadTime.toLocaleString() : "ロード中"}時点）
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}

export const loader = async () => {
  const response_details = await readDetail()
  const response_products = await readProduct()
  return json({
    details: response_details,
    products: response_products,
  })
}

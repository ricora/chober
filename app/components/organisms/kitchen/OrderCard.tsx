import { Box, Button, Input, Stack, Text } from "@chakra-ui/react"
import { Form } from "@remix-run/react"
import { FC, memo } from "react"
import PropTypes from "prop-types"

type Props = {
  orderTime: string
  orderId: number
  productNames: (string | null | undefined)[]
  status: string
  quantities: (number | null | undefined)[]
  tableNumber: number
}

export const OrderCard: FC<Props> = memo((props) => {
  const { orderTime, orderId, productNames, status, quantities, tableNumber } =
    props

  return (
    <Box
      w="300px"
      h="300px"
      bg="white"
      borderRadius="10px"
      shadow="md"
      p={4}
      overflowY="auto"
    >
      <Text>{orderTime}</Text>
      <Stack textAlign={"center"}>
        {productNames.map((name, index) => (
          <Text key={index}>
            {name}--数量：{quantities[index]}
          </Text>
        ))}
        <Text>-------------------------</Text>
        <Text>テーブル番号：{tableNumber}</Text>
        <Text>ステータス：{status}</Text>
        {status === "accept" ? (
          <Form method="post">
            <Input type="hidden" name="order_id" value={orderId} />
            <Input type="hidden" name="status" value="cooking" />
            <Input type="hidden" name="_method" value="update" />
            <Button type="submit" colorScheme="blue">
              start cook
            </Button>
          </Form>
        ) : status === "cooking" ? (
          <Form method="post">
            <Input type="hidden" name="order_id" value={orderId} />
            <Input type="hidden" name="status" value="serve" />
            <Input type="hidden" name="_method" value="update" />
            <Button type="submit" colorScheme="yellow">
              finish cook
            </Button>
          </Form>
        ) : (
          <Form method="post">
            <Input type="hidden" name="order_id" value={orderId} />
            <Input type="hidden" name="status" value="finish" />
            <Input type="hidden" name="_method" value="update" />
            <Button type="submit" colorScheme="red">
              complete
            </Button>
          </Form>
        )}
      </Stack>
    </Box>
  )
})

OrderCard.displayName = "OrderCard"

OrderCard.propTypes = {
  orderTime: PropTypes.string.isRequired,
  orderId: PropTypes.number.isRequired,
  productNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  status: PropTypes.string.isRequired,
  quantities: PropTypes.arrayOf(PropTypes.number).isRequired,
  tableNumber: PropTypes.number.isRequired,
}

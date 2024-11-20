import { Box, Button, Input, Stack, Text } from "@chakra-ui/react"
import { Form } from "@remix-run/react"
import { FC, memo } from "react"
import PropTypes from "prop-types"

type OrderItem = {
  productName: string
  quantity: number
  deleted: boolean
}

type Props = {
  orderTime: string
  orderId: number
  orderItems: OrderItem[]
  status: string
  tableNumber: number
  memo?: string
}

export const OrderCard: FC<Props> = memo((props) => {
  const { orderTime, orderId, orderItems, status, tableNumber, memo } = props

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
        {orderItems.map((item, index) => (
          <Box key={index}>
            <Text>
              {item.productName}
              {item.deleted && " (削除済み)"} -- 数量：{item.quantity}
            </Text>
          </Box>
        ))}
        <Text>-------------------------</Text>
        <Text>テーブル番号：{tableNumber}</Text>
        {memo && memo.trim() !== "" && (
          <Text fontSize="sm" color="red.500" fontWeight="bold" mb={2}>
            ※注文メモ：{memo}
          </Text>
        )}
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
  orderItems: PropTypes.arrayOf(
    PropTypes.shape({
      productName: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      memo: PropTypes.string,
      deleted: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  status: PropTypes.string.isRequired,
  tableNumber: PropTypes.number.isRequired,
  memo: PropTypes.string,
}

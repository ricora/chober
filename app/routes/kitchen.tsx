import { Wrap, WrapItem } from "@chakra-ui/react"
import { PrismaClient } from "@prisma/client"
import {
  ActionFunction,
  ActionFunctionArgs,
  SerializeFrom,
} from "@remix-run/node"
import { json, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { OrderCard } from "~/components/organisms/kitchen/OrderCard"
import { updateOrderStatus } from "~/crud/crud_orders"

export default function Kitchen() {
  const initialData = useLoaderData<typeof loader>()

  const { orders } = useKitchenData(initialData)

  return (
    <>
      <Wrap>
        {orders.map((order) => {
          const createTime = new Date(order.createTime).toLocaleString(
            "ja-JP",
            {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            },
          )

          return (
            <WrapItem key={order.order_id} mx="auto">
              <OrderCard
                orderTime={createTime}
                orderId={order.order_id}
                orderItems={order.orderDetails.map(
                  ({ products, quantity }) => ({
                    productName: products.product_name,
                    quantity,
                    deleted: products.deleted_at !== null,
                  }),
                )}
                tableNumber={order.table_number}
                status={order.status}
                memo={order.memo ?? ""}
              />
            </WrapItem>
          )
        })}
      </Wrap>
    </>
  )
}

export const loader = async () => {
  const prisma = new PrismaClient()
  const orders = await prisma.orders.findMany({
    where: {
      status: {
        not: "finish",
      },
    },
    include: {
      orderDetails: {
        include: {
          products: true,
        },
      },
    },
  })
  return json({
    orders,
  })
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const method = formData.get("_method")

  if (method === "update") {
    const order_id = Number(formData.get("order_id"))
    const status = formData.get("status")

    if (status === "cooking") {
      updateOrderStatus(order_id, "cooking")
    } else if (status === "serve") {
      updateOrderStatus(order_id, "serve")
    } else if (status === "finish") {
      updateOrderStatus(order_id, "finish")
    }

    return { success: true }
  } else {
    return { success: false }
  }
}

const useKitchenData = (data: SerializeFrom<typeof loader>) => {
  const [orders, setOrders] = useState<(typeof data)["orders"]>([])

  const fetcher = useFetcher<typeof data>()

  useEffect(() => {
    if (fetcher.data) {
      setOrders(fetcher.data.orders)
    }
  }, [fetcher.data])

  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/kitchen")
    }, 5000)

    return () => clearInterval(interval)
  }, [fetcher])

  return { orders }
}

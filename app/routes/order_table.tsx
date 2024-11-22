import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  ButtonGroup,
  Button,
  Select,
  HStack,
} from "@chakra-ui/react"
import { json, useLoaderData } from "@remix-run/react"
import { PrismaClient } from "@prisma/client"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

export default function OrderTable() {
  const { orders } = useLoaderData<typeof loader>()

  const columnHelper = createColumnHelper<(typeof orders)[number]>()

  const columns = [
    columnHelper.accessor("order_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createTime", {
      header: "注文日時",
      cell: (info) =>
        new Date(info.getValue()).toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    }),
    columnHelper.accessor("table_number", {
      header: "テーブル番号",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("orderDetails", {
      header: "注文内容",
      cell: (info) =>
        info.getValue().map(({ products, quantity }, index) => (
          <div key={index}>
            {products.product_name}
            {products.deleted_at != null && " (削除済み)"} -- 数量：
            {quantity}
          </div>
        )),
    }),
    columnHelper.accessor("orderDetails", {
      id: "totalPrice",
      header: "売上",
      cell: (info) => {
        const total = info
          .getValue()
          .reduce(
            (sum, detail) => sum + detail.products.price * detail.quantity,
            0,
          )
        return `¥${total}`
      },
    }),
    columnHelper.accessor("status", {
      header: "ステータス",
      cell: (info) => info.getValue(),
    }),
  ]

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <Box p={4} bg={"white"}>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <TableCaption>注文履歴一覧</TableCaption>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <HStack spacing={4} mt={4} justify="flex-end">
          <ButtonGroup size="sm" variant="outline">
            <Button
              onClick={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              前へ
            </Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              次へ
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </ButtonGroup>
          <HStack spacing={2}>
            <span>
              ページ {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <Select
              w="auto"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}件表示
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </TableContainer>
    </Box>
  )
}

export const loader = async () => {
  const prisma = new PrismaClient()
  const orders = await prisma.orders.findMany({
    include: {
      orderDetails: {
        include: {
          products: true,
        },
      },
    },
    orderBy: {
      createTime: "desc",
    },
  })
  return json({
    orders,
  })
}

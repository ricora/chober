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
import {
  json,
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "@remix-run/react"
import { PrismaClient } from "@prisma/client"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { LoaderFunctionArgs } from "@remix-run/node"

export default function OrderTable() {
  const { orders, totalCount } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const pageIndex = Number(searchParams.get("page")) || 0
  const pageSize = Number(searchParams.get("size")) || 10

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
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater
      const newParams = new URLSearchParams(searchParams)
      newParams.set("page", String(newState.pageIndex))
      newParams.set("size", String(newState.pageSize))
      navigate(`?${newParams.toString()}`)
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
              全{totalCount}件中 {pageIndex * pageSize + 1} -{" "}
              {Math.min((pageIndex + 1) * pageSize, totalCount)}件表示
            </span>
            <Select
              w="auto"
              value={pageSize}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams)
                newParams.set("size", e.target.value)
                newParams.set("page", "0")
                navigate(`?${newParams.toString()}`)
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const prisma = new PrismaClient()
  const url = new URL(request.url)
  const page = Number(url.searchParams.get("page")) || 0
  const size = Number(url.searchParams.get("size")) || 10

  const [orders, totalCount] = await prisma.$transaction([
    prisma.orders.findMany({
      skip: page * size,
      take: size,
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
    }),
    prisma.orders.count(),
  ])

  return json({
    orders,
    totalCount,
  })
}

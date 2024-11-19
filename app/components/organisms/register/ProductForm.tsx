import { Form } from "~/components/atoms/Form"
import { type FC } from "react"
import { TypeProduct } from "~/type/typeproduct"
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react"
import { FieldInfo } from "~/components/molecules/FieldInfo"
import * as v from "valibot"
import { getValibotConstraint, parseWithValibot } from "conform-to-valibot"
import { getInputProps, SubmissionResult, useForm } from "@conform-to/react"
import { useNavigation } from "@remix-run/react"

export type ProductFormValues = (
  | Omit<TypeProduct, "product_id">
  | TypeProduct
) & {
  _method: "create" | "update"
}

export const createProductSchema = v.object({
  _method: v.literal("create"),
  product_name: v.pipe(
    v.string("商品名は文字列で入力してください"),
    v.minLength(1, "商品名は1文字以上で入力してください"),
    v.maxLength(255, "商品名は255文字以下で入力してください"),
  ),
  price: v.pipe(
    v.number("価格は数字で入力してください"),
    v.integer("価格は整数で入力してください"),
    v.minValue(0, "価格は0以上で入力してください"),
    v.maxValue(
      Number.MAX_SAFE_INTEGER,
      `価格は${Number.MAX_SAFE_INTEGER}以下で入力してください`,
    ),
  ),
  stock: v.pipe(
    v.number("在庫数は数字で入力してください"),
    v.integer("在庫数は整数で入力してください"),
    v.minValue(0, "在庫数は0以上で入力してください"),
    v.maxValue(
      Number.MAX_SAFE_INTEGER,
      `在庫数は${Number.MAX_SAFE_INTEGER}以下で入力してください`,
    ),
  ),
  image: v.pipe(
    v.string("商品画像は文字列で入力してください"),
    v.url("商品画像は画像URLで入力してください"),
  ),
})

export const updateProductSchema = v.object({
  ...createProductSchema.entries,
  _method: v.literal("update"),
  product_id: v.pipe(
    v.number("製品IDは数字で入力してください"),
    v.integer("製品IDは整数で入力してください"),
    v.minValue(0, "製品IDは0以上で入力してください"),
    v.maxValue(
      Number.MAX_SAFE_INTEGER,
      `製品IDは${Number.MAX_SAFE_INTEGER}以下で入力してください`,
    ),
  ),
})

export type ProductFormProps = {
  _method: "create" | "update"
  defaultValue?: Partial<ProductFormValues> | null | undefined
  submitText: string
  lastResult?: SubmissionResult<string[]> | null | undefined
}

export const ProductForm: FC<ProductFormProps> = ({
  submitText,
  lastResult,
  _method,
  defaultValue,
}) => {
  const navigation = useNavigation()
  const schema =
    _method === "update" ? updateProductSchema : createProductSchema
  const [form, fields] = useForm<ProductFormValues>({
    defaultValue: {
      _method,
      ...defaultValue,
    },
    constraint: getValibotConstraint(schema),
    lastResult: navigation.state === "idle" ? lastResult : null,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: () => {
      console.log("onSubmit")
    },
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema })
    },
  })

  return (
    <Form
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
      w="full"
      noValidate
    >
      <VStack gap={4}>
        <Input
          {...getInputProps(fields._method, { type: "text" })}
          key={fields.product_id.key}
          hidden
        />
        {_method === "update" && (
          <Input
            {...getInputProps(fields.product_id, { type: "number" })}
            key={fields.product_id.key}
            hidden
          />
        )}
        <FormControl isInvalid={!fields.product_name.valid}>
          <FormLabel>商品名</FormLabel>
          <Input
            {...getInputProps(fields.product_name, { type: "text" })}
            key={fields.product_name.key}
            placeholder="焼きそば"
          />
          <FieldInfo errors={fields.product_name.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.price.valid}>
          <FormLabel>価格</FormLabel>
          <Input
            {...getInputProps(fields.price, { type: "number" })}
            key={fields.price.key}
            placeholder="500"
          />
          <FieldInfo errors={fields.price.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.stock.valid}>
          <FormLabel>在庫</FormLabel>
          <Input
            {...getInputProps(fields.stock, { type: "number" })}
            key={fields.stock.key}
            placeholder="100"
          />
          <FieldInfo errors={fields.stock.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.image.valid}>
          <FormLabel>商品画像</FormLabel>
          <Input
            {...getInputProps(fields.image, { type: "text" })}
            key={fields.image.key}
            placeholder="https://example.com/image.jpg"
          />
          <FieldInfo
            errors={fields.image.errors}
            helperText="商品画像は画像URLで入力してください"
          />
        </FormControl>
        <Button type="submit" alignSelf="end">
          {submitText}
        </Button>
      </VStack>
    </Form>
  )
}

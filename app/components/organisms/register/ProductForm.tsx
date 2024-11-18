import { Form } from "~/components/atoms/Form"
import type { FC } from "react"
import { TypeProduct } from "~/type/typeproduct"
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react"
import { FieldInfo } from "~/components/molecules/FieldInfo"
import * as v from "valibot"
import { parseWithValibot } from "conform-to-valibot"
import { useForm } from "@conform-to/react"

export type ProductFormValues = Omit<TypeProduct, "product_id">

export const productSchema = v.object({
  product_name: v.pipe(
    v.string("商品名は文字列で入力してください"),
    v.minLength(1, "商品名は1文字以上で入力してください"),
    v.maxLength(255, "商品名は255文字以下で入力してください"),
  ),
  price: v.pipe(
    v.number("価格は数字で入力してください"),
    v.integer("価格は整数で入力してください"),
    v.minValue(0, "価格は0以上で入力してください"),
  ),
  stock: v.pipe(
    v.number("在庫数は数字で入力してください"),
    v.integer("在庫数は整数で入力してください"),
    v.minValue(0, "在庫数は0以上で入力してください"),
  ),
  image: v.pipe(
    v.string("商品画像は文字列で入力してください"),
    v.url("商品画像は画像URLで入力してください"),
  ),
})

export type ProductFormProps = {
  submitText: string
}

export const ProductForm: FC<ProductFormProps> = ({ submitText }) => {
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => {
      return parseWithValibot(formData, { schema: productSchema })
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
        <FormControl isInvalid={!fields.product_name.valid}>
          <FormLabel>商品名</FormLabel>
          <Input
            type="text"
            placeholder="焼きそば"
            name={fields.product_name.name}
            required={fields.product_name.required}
            defaultValue={fields.product_name.initialValue}
          />
          <FieldInfo errors={fields.product_name.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.price.valid}>
          <FormLabel>価格</FormLabel>
          <Input
            type="number"
            placeholder="500"
            name={fields.price.name}
            required={fields.price.required}
            defaultValue={fields.price.initialValue}
          />
          <FieldInfo errors={fields.price.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.stock.valid}>
          <FormLabel>在庫</FormLabel>
          <Input
            type="number"
            placeholder="100"
            name={fields.stock.name}
            required={fields.stock.required}
            defaultValue={fields.stock.initialValue}
          />
          <FieldInfo errors={fields.stock.errors} />
        </FormControl>
        <FormControl isInvalid={!fields.image.valid}>
          <FormLabel>商品画像</FormLabel>
          <Input
            type="text"
            placeholder="https://example.com/image.jpg"
            name={fields.image.name}
            required={fields.image.required}
            defaultValue={fields.image.initialValue}
          />
          <FieldInfo
            errors={fields.image.errors}
            helperText="商品画像は画像URLで入力してください"
          />
        </FormControl>
        <Button type="submit" disabled={!form.valid} alignSelf="end">
          {submitText}
        </Button>
      </VStack>
    </Form>
  )
}

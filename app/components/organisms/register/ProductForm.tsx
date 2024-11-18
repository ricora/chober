import { Form } from "~/components/atoms/Form"
import { FormApi, ReactFormApi } from "@tanstack/react-form"
import type { FC } from "react"
import { TypeProduct } from "~/type/typeproduct"
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react"
import { FieldInfo } from "~/components/molecules/FieldInfo"

export type ProductFormValues = Omit<TypeProduct, "product_id">

export type ProductFormProps = {
  form: FormApi<ProductFormValues> & ReactFormApi<ProductFormValues>
  submittingText: string
  submitText: string
}

export const ProductForm: FC<ProductFormProps> = ({
  form,
  submitText,
  submittingText,
}) => {
  return (
    <Form method="post" onSubmit={() => form.handleSubmit()} w="full">
      <VStack gap={4}>
        <form.Field name="product_name">
          {(field) => (
            <FormControl isInvalid={field.state.meta.errors.length > 0}>
              <FormLabel>商品名</FormLabel>
              <Input
                type="text"
                placeholder="焼きそば"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </FormControl>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <FormControl isInvalid={field.state.meta.errors.length > 0}>
              <FormLabel>価格</FormLabel>
              <Input
                type="number"
                placeholder="500"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldInfo field={field} />
            </FormControl>
          )}
        </form.Field>
        <form.Field name="stock">
          {(field) => (
            <FormControl isInvalid={field.state.meta.errors.length > 0}>
              <FormLabel>在庫</FormLabel>
              <Input
                type="number"
                placeholder="100"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldInfo field={field} />
            </FormControl>
          )}
        </form.Field>
        <form.Field name="image">
          {(field) => (
            <FormControl isInvalid={field.state.meta.errors.length > 0}>
              <FormLabel>商品画像</FormLabel>
              <Input
                type="text"
                placeholder="https://example.com/image.jpg"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo
                field={field}
                helperText="商品画像は画像URLで入力してください"
              />
            </FormControl>
          )}
        </form.Field>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={submittingText}
              disabled={!canSubmit}
              alignSelf="end"
            >
              {submitText}
            </Button>
          )}
        </form.Subscribe>
      </VStack>
    </Form>
  )
}

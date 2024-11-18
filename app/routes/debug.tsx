import { ActionFunctionArgs } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { mergeForm, useForm, useTransform } from "@tanstack/react-form"

import {
  ServerValidateError,
  createServerValidate,
  formOptions,
  initialFormState,
} from "@tanstack/react-form/remix"
import {
  ProductForm,
  ProductFormValues,
} from "~/components/organisms/register/ProductForm"

const formOpts = formOptions({
  defaultValues: {
    product_name: "",
    price: 0,
    stock: 0,
    image: "",
  } satisfies ProductFormValues,
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.stock < 12) {
      return "Server validation: You must be at least 12 to sign up"
    }
  },
})

export default function Debug() {
  const actionData = useActionData<typeof action>()

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData],
    ),
  })
  const formErrors = form.useStore((formState) => formState.errors)

  return <ProductForm form={form} />
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  try {
    await serverValidate(formData)
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
  return null
}

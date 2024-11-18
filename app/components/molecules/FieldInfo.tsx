import { FormErrorMessage, FormHelperText } from "@chakra-ui/react"
import { FieldApi } from "@tanstack/react-form"
import { FC, ReactNode } from "react"

export type FieldInfoProps = {
  field: FieldApi<any, any, any, any>
  helperText?: ReactNode
}

export const FieldInfo: FC<FieldInfoProps> = ({ field, helperText }) => {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <FormErrorMessage>{field.state.meta.errors.join(",")}</FormErrorMessage>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </>
  )
}

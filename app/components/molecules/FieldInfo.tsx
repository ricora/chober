import { FormErrorMessage, FormHelperText } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

export type FieldInfoProps = {
  errors?: string[] | undefined
  helperText?: ReactNode
}

export const FieldInfo: FC<FieldInfoProps> = ({ errors, helperText }) => {
  return (
    <>
      {errors ? (
        <FormErrorMessage>{errors.join(",")}</FormErrorMessage>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </>
  )
}

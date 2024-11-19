import { Button, Grid, Text, Tooltip, VStack } from "@chakra-ui/react"
import { FC, memo } from "react"
import { useTokens } from "~/hooks/useToken"
import { renderToken } from "~/lib/calculate"

export type CalculatorProps = {
  total: number
}

export const Calculator: FC<CalculatorProps> = memo(({ total }) => {
  const { onInput, clear, tokens, input, calculate } = useTokens()

  return (
    <VStack
      w="fit-content"
      bg="blackAlpha.500"
      borderRadius="10px"
      shadow="lg"
      p={4}
      gap={4}
    >
      <VStack
        gap={0}
        py={2}
        px={4}
        minH={20}
        justifyContent="center"
        alignItems="end"
        bg="InfoBackground"
        rounded="md"
        width="full"
      >
        <Text color="GrayText">{tokens.map(renderToken).join(" ")}</Text>
        <Text color="InfoText" fontSize="xl">
          {input}
        </Text>
      </VStack>
      <Grid
        w="fit-content"
        gap={4}
        templateColumns="repeat(4, 1fr)"
        placeItems="center"
        placeContent="center"
      >
        <Button onClick={() => onInput(7)}>7</Button>
        <Button onClick={() => onInput(8)}>8</Button>
        <Button onClick={() => onInput(9)}>9</Button>
        <Button onClick={() => onInput("*")}>×</Button>
        <Button onClick={() => onInput(4)}>4</Button>
        <Button onClick={() => onInput(5)}>5</Button>
        <Button onClick={() => onInput(6)}>6</Button>
        <Button onClick={() => onInput("-")}>−</Button>
        <Button onClick={() => onInput(1)}>1</Button>
        <Button onClick={() => onInput(2)}>2</Button>
        <Button onClick={() => onInput(3)}>3</Button>
        <Button onClick={() => onInput("+")}>+</Button>
        <Button onClick={() => onInput(0)}>0</Button>
        <Tooltip hasArrow label="合計金額">
          <Button onClick={() => onInput(total)}>T</Button>
        </Tooltip>
        <Button onClick={() => clear()}>C</Button>
        <Button onClick={() => calculate()}>=</Button>
      </Grid>
    </VStack>
  )
})
Calculator.displayName = "Calculator"

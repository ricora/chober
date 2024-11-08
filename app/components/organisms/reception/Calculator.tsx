import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { FC, memo, useState } from "react"

type props = {
  total?: string
}

export const Calculator: FC<props> = memo(({ total }) => {
  const totalCost = total
  const [value1, setValue1] = useState<string>("0")
  const [value2, setValue2] = useState<string | undefined>("0")
  const [change, setChange] = useState<"1" | "2">("1")
  const [status, setStatus] = useState<"init" | "sum" | "minus" | "times">(
    "init",
  )

  const onClickSetValue1 = (input: string) => {
    const a = value1 === "0" ? input : value1 + input
    setValue1(a)
  }

  const onClickSetValue2 = (input: string) => {
    const a = value2 === "0" ? input : value2 + input
    setValue2(a)
  }

  const onClickSum = () => {
    setStatus("sum")
    setChange("2")
  }

  const onClickMin = () => {
    setStatus("minus")
    setChange("2")
  }

  const onClickTimes = () => {
    setStatus("times")
    setChange("2")
  }

  const onClickResult = () => {
    const result =
      status === "init"
        ? value1
        : status === "sum"
          ? Number(value1) + Number(value2)
          : status === "minus"
            ? Number(value1) - Number(value2)
            : status === "times"
              ? Number(value1) * Number(value2)
              : Number(value1) / Number(value2)
    setValue1(result.toString())
    setStatus("init")
    setValue2("0")
    setChange("1")
  }

  const onClickInitial = () => {
    setValue1("0")
    setValue2("0")
  }

  const onClickTotalCost = () => {
    setValue2(totalCost)
  }

  return (
    <Box
      w="300px"
      h="250px"
      bg="blackAlpha.500"
      borderRadius="10px"
      shadow="lg"
      p={4}
    >
      <VStack>
        <Text fontSize={"xl"}>{value2 === "0" ? value1 : value2}</Text>
        <HStack>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("7") : onClickSetValue2("7")
            }
          >
            7
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("8") : onClickSetValue2("8")
            }
          >
            8
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("9") : onClickSetValue2("9")
            }
          >
            9
          </Button>
          <Button onClick={onClickTimes}>*</Button>
        </HStack>
        <HStack>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("4") : onClickSetValue2("4")
            }
          >
            4
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("5") : onClickSetValue2("5")
            }
          >
            5
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("6") : onClickSetValue2("6")
            }
          >
            6
          </Button>
          <Button onClick={onClickMin}>-</Button>
        </HStack>
        <HStack>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("1") : onClickSetValue2("1")
            }
          >
            1
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("2") : onClickSetValue2("2")
            }
          >
            2
          </Button>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("3") : onClickSetValue2("3")
            }
          >
            3
          </Button>
          <Button onClick={onClickSum}>+</Button>
        </HStack>
        <HStack>
          <Button
            onClick={() =>
              change === "1" ? onClickSetValue1("0") : onClickSetValue2("0")
            }
            // w={"78px"}
          >
            0
          </Button>
          <Button isDisabled={change === "1"} onClick={onClickTotalCost}>
            T
          </Button>
          <Button onClick={onClickInitial}>C</Button>
          <Button onClick={onClickResult}>=</Button>
        </HStack>
      </VStack>
    </Box>
  )
})

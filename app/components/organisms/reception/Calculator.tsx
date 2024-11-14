import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react"
import { FC, memo } from "react"
import PropTypes from "prop-types"

export const Calculator: FC = memo(() => {
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
        <Text></Text>
        <HStack>
          <Button>7</Button>
          <Button>8</Button>
          <Button>9</Button>
          <Button>*</Button>
        </HStack>
        <HStack>
          <Button>4</Button>
          <Button>5</Button>
          <Button>6</Button>
          <Button>-</Button>
        </HStack>
        <HStack>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>+</Button>
        </HStack>
        <HStack>
          <Button>0</Button>
          <Button>T</Button>
          <Button>C</Button>
          <Button>=</Button>
        </HStack>
      </VStack>
    </Box>
  )
})

Calculator.displayName = "Calculator"

Calculator.propTypes = {
  total: PropTypes.string.isRequired,
}

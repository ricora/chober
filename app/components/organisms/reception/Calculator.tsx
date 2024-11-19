import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react"
import { FC, memo } from "react"

export const Calculator: FC = memo(() => {
  return (
    <Grid
      w="fit-content"
      bg="blackAlpha.500"
      borderRadius="10px"
      shadow="lg"
      p={4}
      templateColumns="repeat(4, 1fr)"
      placeItems="center"
      placeContent="center"
      gap={2}
    >
      <Button>7</Button>
      <Button>8</Button>
      <Button>9</Button>
      <Button>*</Button>
      <Button>4</Button>
      <Button>5</Button>
      <Button>6</Button>
      <Button>-</Button>
      <Button>1</Button>
      <Button>2</Button>
      <Button>3</Button>
      <Button>+</Button>
      <Button>0</Button>
      <Button>T</Button>
      <Button>C</Button>
      <Button>=</Button>
    </Grid>
  )
})

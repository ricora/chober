import { Heading, HStack, Text, useDisclosure } from "@chakra-ui/react"
import { Link, useNavigate } from "@remix-run/react"
import { useCallback } from "react"
import { MenuIconButton } from "~/components/atoms/button/MenuIconButton"
import { MenuDrawer } from "~/components/molecules/MenuDrawer"

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const onClickHome = useCallback(() => {
    navigate("/")
    onClose()
  }, [navigate, onClose])
  const onClickReception = useCallback(() => {
    navigate("/reception")
    onClose()
  }, [navigate, onClose])
  const onClickRegister = useCallback(() => {
    navigate("/register")
    onClose()
  }, [navigate, onClose])
  const onClickKitchen = useCallback(() => {
    navigate("/kitchen")
    onClose()
  }, [navigate, onClose])
  const onClickOrderTable = useCallback(() => {
    navigate("/order_table")
    onClose()
  }, [navigate, onClose])

  return (
    <>
      <HStack
        bg="blackAlpha.100"
        padding={4}
        gap={4}
        backdropFilter="auto"
        backdropBlur="lg"
      >
        <MenuIconButton onOpen={onOpen} />
        <Heading _hover={{ cursor: "pointer" }}>
          <Link to="/">
            <Text fontSize="4xl" fontFamily='"Times New Roman", serif'>
              Order
            </Text>
          </Link>
        </Heading>
      </HStack>
      <MenuDrawer
        onClose={onClose}
        isOpen={isOpen}
        onClickHome={onClickHome}
        onClickReception={onClickReception}
        onClickRegister={onClickRegister}
        onClickKitchen={onClickKitchen}
        onClickOrderTable={onClickOrderTable}
      />
    </>
  )
}

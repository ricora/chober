import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react"
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

  return (
    <>
      <Flex
        bg="teal.500"
        padding={{ base: 3, lg: 5 }}
        position="fixed"
        top="0" // 画面の一番上に配置
        left="0"
        width="100%" // 幅を画面全体に広げる
        zIndex="1000" // 他の要素より前面に表示
        boxShadow="md" // 少し影をつける
      >
        <MenuIconButton onOpen={onOpen} />
        <Heading _hover={{ cursor: "pointer" }}>
          <Link to="/">
            <Text fontFamily='"Times New Roman", serif'>Order</Text>
          </Link>
        </Heading>
      </Flex>
      <MenuDrawer
        onClose={onClose}
        isOpen={isOpen}
        onClickHome={onClickHome}
        onClickReception={onClickReception}
        onClickRegister={onClickRegister}
        onClickKitchen={onClickKitchen}
      />
    </>
  )
}

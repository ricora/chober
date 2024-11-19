import { useState } from "react"
import { calculate as calculateTokens, Token } from "~/lib/calculate"

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [input, setInput] = useState<number>(0)

  const pushToken = (token: Token) => setTokens((prev) => [...prev, token])
  const popToken = () => setTokens((prev) => prev.slice(0, -1))
  const clearTokens = () => setTokens([])

  const onInput = (token: Token) => {
    if (typeof token === "number") {
      setInput((prev) => Number.parseInt(prev.toString() + token.toString()))
    } else {
      pushToken(input)
      setInput(0)
      pushToken(token)
    }
  }

  const clear = () => {
    setInput(0)
    clearTokens()
  }

  const calculate = () => {
    const output = calculateTokens([...tokens, input])
    clearTokens()
    setInput(output)
    return output
  }

  return {
    tokens,
    setTokens,
    pushToken,
    popToken,
    clearTokens,
    input,
    setInput,
    onInput,
    clear,
    calculate,
  } as const
}

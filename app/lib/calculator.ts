export type ParenthesisToken = "(" | ")"

export type OperatorToken = "+" | "-" | "*" | "/"

export type Token = number | OperatorToken | ParenthesisToken

export type Expression = Num | Operator

export type Num = {
  type: "number"
  value: number
  lhs?: Expression
  rhs?: Expression
}

export type Operator = {
  type: "operator"
  value: OperatorToken
  lhs: Expression
  rhs: Expression
}

export const renderToken = (token: Token): string => {
  switch (token) {
    case "*":
      return "×"
    case "-":
      return "−"
    default:
      return token.toString()
  }
}

export const isOperator = (token?: Token): token is OperatorToken =>
  token === "+" || token === "-" || token === "*" || token === "/"

export const isNumber = (token?: Token): token is number =>
  typeof token === "number"

export const calculate = (tokens: Token[]): number => {
  const expr = parse(tokens)
  return calculateExpr(expr)
}

const calculateExpr = (expr: Expression): number => {
  if (expr.type === "number") {
    return expr.value
  }

  if (expr.type === "operator") {
    const lhs = calculateExpr(expr.lhs)
    const rhs = calculateExpr(expr.rhs)
    switch (expr.value) {
      case "+":
        return lhs + rhs
      case "-":
        return lhs - rhs
      case "*":
        return lhs * rhs
      case "/":
        return lhs / rhs
    }
  }
  throw new Error("Invalid expression")
}

// primary = "(" expr ")" | number
const parsePrimary = (tokens: Token[]): [Expression, Token[]] => {
  const token = tokens[0]
  if (token === "(") {
    const [expr, rest] = parseExpr(tokens.slice(1))
    if (rest[0] !== ")") {
      throw new Error("Invalid expression, expected ')'")
    }
    return [expr, rest.slice(1)]
  }
  if (typeof token === "number") {
    return [{ type: "number", value: token }, tokens.slice(1)]
  }
  throw new Error("Invalid expression, expected number or '('")
}

// mul = primary ("*" primary | "/" primary)*
const parseMul = (tokens: Token[]): [Expression, Token[]] => {
  let [lhs, rest] = parsePrimary(tokens)
  while (rest.length > 0) {
    const token = rest[0]
    if (token === "*" || token === "/") {
      const [rhs, rest2] = parsePrimary(rest.slice(1))
      lhs = { type: "operator", value: token, lhs, rhs }
      rest = rest2
    } else {
      break
    }
  }
  return [lhs, rest]
}

// expr = mul ("+" mul | "-" mul)*
const parseExpr = (tokens: Token[]): [Expression, Token[]] => {
  let [lhs, rest] = parseMul(tokens)
  while (rest.length > 0) {
    const token = rest[0]
    if (token === "+" || token === "-") {
      const [rhs, rest2] = parseMul(rest.slice(1))
      lhs = { type: "operator", value: token, lhs, rhs }
      rest = rest2
    } else {
      break
    }
  }
  return [lhs, rest]
}

/**
 * 数式のトークン列をパースして、計算順序を表す木構造を返す
 */
const parse = (tokens: Token[]): Expression => {
  const [expr, rest] = parseExpr(tokens)
  if (rest.length > 0) {
    throw new Error("Invalid expression")
  }
  return expr
}

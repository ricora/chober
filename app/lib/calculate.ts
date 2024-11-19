export type Token = number | "+" | "-" | "*" | "/" | "(" | ")"

export type Expression = Num | Operator

export type Num = {
  type: "number"
  value: number
  lhs?: Expression
  rhs?: Expression
}

export type Operator = {
  type: "operator"
  value: "+" | "-" | "*" | "/"
  lhs: Expression
  rhs: Expression
}

export const calculate = (tokens: Token[]): number => {
  const expr = parse(tokens)
  return calculate_expr(expr)
}

const calculate_expr = (expr: Expression): number => {
  if (expr.type === "number") {
    return expr.value
  }

  if (expr.type === "operator") {
    const lhs = calculate_expr(expr.lhs)
    const rhs = calculate_expr(expr.rhs)
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
const parse_primary = (tokens: Token[]): [Expression, Token[]] => {
  const token = tokens[0]
  if (token === "(") {
    const [expr, rest] = parse_expr(tokens.slice(1))
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
const parse_mul = (tokens: Token[]): [Expression, Token[]] => {
  let [lhs, rest] = parse_primary(tokens)
  while (rest.length > 0) {
    const token = rest[0]
    if (token === "*" || token === "/") {
      const [rhs, rest2] = parse_primary(rest.slice(1))
      lhs = { type: "operator", value: token, lhs, rhs }
      rest = rest2
    } else {
      break
    }
  }
  return [lhs, rest]
}

// expr = mul ("+" mul | "-" mul)*
const parse_expr = (tokens: Token[]): [Expression, Token[]] => {
  let [lhs, rest] = parse_mul(tokens)
  while (rest.length > 0) {
    const token = rest[0]
    if (token === "+" || token === "-") {
      const [rhs, rest2] = parse_mul(rest.slice(1))
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
  const [expr, rest] = parse_expr(tokens)
  if (rest.length > 0) {
    throw new Error("Invalid expression")
  }
  return expr
}

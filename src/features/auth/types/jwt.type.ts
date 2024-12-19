type JwtHeader = {
    alg: string,
    typ: string
}

type JwtPayload = Record<string, string | number>
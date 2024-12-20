export interface JwtHeader {
    alg: string,
    typ: string
}

export interface UserClaims {
    userId: string,
    login?: string,
    exp: number
}

export type JwtPayload = Record<string, string | number>
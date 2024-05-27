export type TJwtPayload = {
    id: string,
    username: string,
    email: string,
    fingerprint?: string,
    exp?: number
}
import { COMMON_KEY_NAME } from "../enums/token"

export type Require<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>

export type TUserState = {
    [COMMON_KEY_NAME.ACCESS_TOKEN]: string,
    username: string,
    email: string,
    picture: string,
    isSession: boolean
}
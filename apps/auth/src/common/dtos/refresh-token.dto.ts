import { TOKEN_KEY_NAME } from "../enums";

export class RefreshTokenDto {
    [TOKEN_KEY_NAME.ACCESS_TOKEN]: string
}
export enum TOKEN_KEY_NAME {
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token',
    FINGERPRINT = 'fingerprint',
    ONE_TIME_TOKEN = 'one_time_token',
    GOOGLE_ID_TOKEN = 'google_id_token'
}

const minute = 1000 * 60
const hour = minute * 60

export enum TOKEN_EXPIRY_TIME {
    ACCESS_TOKEN = minute * 30,
    REFRESH_TOKEN = hour * 24,
    ONE_TIME_TOKEN = hour * 24,
    GOOGLE_ID_TOKEN = hour
}
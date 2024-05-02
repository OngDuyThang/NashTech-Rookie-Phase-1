export enum SUCCESS_MESSAGE {}

export enum ERROR_MESSAGE {
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    SERVICE_UNAVAILABLE = 'Service Unavailable',
    NOT_FOUND = 'Resources Not Found',
    BAD_REQUEST = 'Bad Request',
    UNAUTHORIZED = 'Unauthorized Credential',
    FORBIDDEN = 'Access Denied',
    CONFLICT = 'Resources Conflict',
    GONE = 'Resources Deprecated',
    TIME_OUT = 'Request Time Out',
    METHOD_NOT_ALLOWED = 'Method Not Allowed',
    UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
    INVALID_CREDENTIAL = 'Invalid Credential',
    INVALID_OTP = 'Invalid OTP',
    USER_UNAUTHORIZED = 'User Unauthorized',
    USER_NOT_EXIST = 'User Not Exist'
}
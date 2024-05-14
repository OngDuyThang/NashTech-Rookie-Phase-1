export enum SUCCESS_MESSAGE {
    REGISTERED = 'You have successfully registered',
    EMAIL_SENT = 'We have sent you an email'
}

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
    USER_NOT_EXIST = 'User Not Exist',
    INVALID_EMAIL = 'Invalid Email',
    PASSWORD_NOT_MATCH = 'Passwords Not Matching',
    EMAIL_ALREADY_USED = 'Email Already Used',
    INVALID_FORMAT_DATA = 'Invalid Format Data',
    UNAUTHORIZED_GOOGLE_ACCOUNT = 'Unauthorized Google Account'
}
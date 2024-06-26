export enum QUEUE_NAME {
    AUTH = 'AUTH_QUEUE',
    PRODUCT = 'PRODUCT_QUEUE',
    CART = 'CART_QUEUE',
    ORDER = 'ORDER_QUEUE'
}

export enum SERVICE_NAME {
    AUTH_SERVICE = 'AUTH_SERVICE',
    PRODUCT_SERVICE = 'PRODUCT_SERVICE',
    CART_SERVICE = 'CART_SERVICE',
    ORDER_SERVICE = 'ORDER_SERVICE'
}

export enum SERVICE_MESSAGE {
    VALIDATE_JWT = 'VALIDATE_JWT',
    GET_PRODUCT_BY_ID = 'GET_PRODUCT_BY_ID',
    REMOVE_CART_ITEM = 'DELETE_CART_ITEM',
    GET_CART_BY_USER = 'GET_CART_BY_USER',
    DELETE_CART = 'DELETE_CART',
    GET_POPULAR_PRODUCTS = 'GET_POPULAR_PRODUCTS',
    FIND_ORDER_PROMOTION = 'FIND_ORDER_PROMOTION'
}
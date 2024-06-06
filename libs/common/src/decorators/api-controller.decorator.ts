import { Controller } from "@nestjs/common"

export const ApiController = (
    prefix: string,
    _version = 1
): ClassDecorator => {
    return Controller(`/api/${prefix}`)
}
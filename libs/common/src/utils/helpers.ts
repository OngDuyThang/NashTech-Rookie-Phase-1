import { BadRequestException } from "@nestjs/common"
import { ClassConstructor, plainToInstance } from "class-transformer"
import { validateSync } from "class-validator"

export const getEnvFilePath = (serviceName: string) => `./apps/${serviceName}/.env.${process.env.NODE_ENV}`

export const classValidate = <T = unknown>(
    validationClass: ClassConstructor<T>,
    config: Record<string, unknown>
): T => {
    const object = plainToInstance(validationClass, config, {
        enableImplicitConversion: true
    }) as object

    const errors = validateSync(object, {
        skipMissingProperties: false
    })

    if (errors.length) {
        throw new BadRequestException()
    }

    return object as T
}
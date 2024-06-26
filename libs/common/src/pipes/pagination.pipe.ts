import { ArgumentMetadata, Injectable, MethodNotAllowedException, PipeTransform } from "@nestjs/common";
import { ERROR_MESSAGE } from "../enums/messages";
import { PaginationDto } from "../dtos/pagination.dto";

@Injectable()
export class PaginationPipe implements PipeTransform {
    transform(value: PaginationDto, metadata: ArgumentMetadata): PaginationDto {
        if (
            metadata.type != 'query' &&
            metadata.type != 'body'
        ) {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        for (let key in value) {
            if (Number.isInteger(Number(value[key]))) {
                value[key] = Number(value[key])
            }
        }

        return value
    }
}
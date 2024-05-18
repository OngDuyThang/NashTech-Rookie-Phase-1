import { ArgumentMetadata, Injectable, MethodNotAllowedException, PipeTransform } from "@nestjs/common";
import { ERROR_MESSAGE } from "../enums/messages";
import { PaginationDto } from "../dtos/pagination.dto";

@Injectable()
export class PaginationPipe implements PipeTransform {
    transform(value: PaginationDto, metadata: ArgumentMetadata): PaginationDto {
        if (metadata.type != 'query') {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        return {
            page: Number(value.page),
            limit: Number(value.limit)
        }
    }
}
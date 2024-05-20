import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ERROR_MESSAGE } from "../enums/messages";

@Injectable()
export class NumberPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value == undefined) {
            return
        }

        if (isNaN(Number(value)) || metadata.type != 'query') {
            throw new BadRequestException(ERROR_MESSAGE.NUMBER_PIPE);
        }

        return Number(value)
    }
}
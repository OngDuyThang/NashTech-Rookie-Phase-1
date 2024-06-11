import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ERROR_MESSAGE } from '../enums/messages';

@Injectable()
export class NumberPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value == undefined) {
      return;
    }

    if (isNaN(Number(value))) {
      throw new BadRequestException(ERROR_MESSAGE.NUMBER_PIPE);
    }

    return Number(value);
  }
}

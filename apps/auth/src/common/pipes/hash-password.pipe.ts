import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../modules/user/dtos/register.dto';
import { ResetPasswordDto } from '../dtos';
import { ERROR_MESSAGE } from '@app/common';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(
    dto: any,
    metadata: ArgumentMetadata,
  ): Promise<RegisterDto | ResetPasswordDto> {
    try {
      if (metadata.type != 'body') return;

      const salt = await bcrypt.genSalt();
      if (dto?.password) {
        const hashedPassword = await bcrypt.hash(dto?.password, salt);
        return {
          ...dto,
          password: hashedPassword,
        };
      }

      if (dto?.newPassword) {
        const hashedPassword = await bcrypt.hash(dto?.newPassword, salt);
        return {
          ...dto,
          newPassword: hashedPassword,
        };
      }

      throw new BadRequestException(ERROR_MESSAGE.INVALID_CREDENTIAL);
    } catch (e) {
      throw e;
    }
  }
}

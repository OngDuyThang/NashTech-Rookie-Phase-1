import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity, UserService } from '../../modules/user';
import { AuthService } from '../../auth.service';
import { ERROR_MESSAGE } from '@app/common';
import { ResetPasswordDto } from '../dtos';
import { TOKEN_KEY_NAME } from '../enums';

@Injectable()
export class ValidateOttGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as UserEntity;

    const { newPassword, confirmPassword } = req.body as ResetPasswordDto;
    if (newPassword != confirmPassword) {
      throw new BadRequestException(ERROR_MESSAGE.PASSWORD_NOT_MATCH);
    }

    const hashedOneTimeToken = req.cookies?.[TOKEN_KEY_NAME.ONE_TIME_TOKEN];
    const isMatch = await this.authService.validateOneTimeToken(
      hashedOneTimeToken,
      user.one_time_token,
    );
    if (!isMatch) {
      throw new ForbiddenException(ERROR_MESSAGE.UNAUTHORIZED);
    }

    await this.userService.updateOneTimeToken(user.id, null);
    return true;
  }
}

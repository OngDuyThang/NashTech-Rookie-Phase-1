import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../modules/user';
import { classValidate } from '@app/common';
import { ResetPasswordDto } from '../dtos';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    if (req.method == 'GET') {
      classValidate(ResetPasswordDto, { userId: req.query?.userId });
    }

    if (req.method == 'POST') {
      classValidate(ResetPasswordDto, req.body);
    }

    const user = await this.userService.findOneById(
      req.method == 'GET' ? (req.query?.userId as string) : req.body?.userId,
    );
    delete user.password;
    req.user = user;

    return true;
  }
}

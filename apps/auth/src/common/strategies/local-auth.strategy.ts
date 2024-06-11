import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth.service';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { Request } from 'express';
import { classValidate, classValidateWithoutThrow } from '@app/common';
import { LoginEmailDto, LoginUsernameDto } from '../dtos';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'usernameOrEmail', passReqToCallback: true });
  }

  async validate(
    req: Request,
    usernameOrEmail: string,
    password: string,
  ): Promise<UserEntity> {
    const result = classValidateWithoutThrow(LoginEmailDto, req.body);
    if (result == null) {
      classValidate(LoginUsernameDto, req.body);
    }

    const user = await this.authService.validateCredential(
      usernameOrEmail,
      password,
    );
    delete user.password;
    return user;
  }
}

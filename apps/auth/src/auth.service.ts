import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) {}

  register(
    registerDto: RegisterDto
  ) {
    try {

    } catch (e) {

    }
  }
}

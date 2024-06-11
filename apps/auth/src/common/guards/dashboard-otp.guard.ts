import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../../auth.service';
import { classValidate } from '@app/common';
import { ValidateOtpDto } from '../dtos';

@Injectable()
export class DashboardOtpGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const { otp, userId } = classValidate(ValidateOtpDto, req.body);
    const loginRes = await this.authService.dashboardValidateOtp(otp, userId);
    req.user = loginRes;

    return true;
  }
}

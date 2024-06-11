import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() == 'http') {
      const req = context.switchToHttp().getRequest<Request>();
      return req.user;
    }

    if (context.getType() == 'rpc') {
      const req = context.switchToRpc().getData();
      return req.user;
    }
  },
);

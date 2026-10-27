import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestPayload } from '../dtos';

export const User = createParamDecorator(
  (data: keyof UserRequestPayload, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);

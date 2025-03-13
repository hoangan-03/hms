import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentPatient = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      return user && user[data] ? user[data] : null;
    }
  }
);
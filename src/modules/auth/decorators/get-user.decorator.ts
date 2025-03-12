import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Patient } from '@/entities/patient.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Patient => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
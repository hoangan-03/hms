import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Patient } from '@/entities/patient.entity';

export const AuthPatient = createParamDecorator(
  (data: keyof Patient, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as Patient;

    return data ? user && user[data] : user;
  },
);
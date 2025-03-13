import { Patient } from '@/entities/patient.entity';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, patient: Patient, info: any): any {
    if (err || !patient) {
      throw err + " " + info || new UnauthorizedException('Authentication required');
    }
    return patient;
  }
}
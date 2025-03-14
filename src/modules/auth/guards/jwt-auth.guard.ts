import { Patient } from '@/entities/patient.entity';
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // handleRequest(err: any, patient: Patient, info: any): any {
  //   // If there's an error or no patient was returned from the strategy
  //   if (err || !patient) {
  //     // Throw a proper unauthorized exception
  //     console.log(info.message);
  //     throw new UnauthorizedException(
  //       info ? info.message : 'Authentication required'
  //     );
     
  //   }
  //   return patient;
  // }
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Patient } from '@/entities/patient.entity';
import { Doctor } from '@/entities/doctor.entity';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passReqToCallback: false,
    });
  }

  async validate(username: string, password: string): Promise<Patient | Doctor> {
    return this.authService.validateUser(username, password);
  }
}
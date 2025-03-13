import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@/modules/auth/auth.service';
import { AuthTokenResponseDto } from '../dtos/auth-token-response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passReqToCallback: false,
    });
  }

  validate(username: string, password: string): Promise<AuthTokenResponseDto> {
    return this.authService.login(username, password);
  }
}
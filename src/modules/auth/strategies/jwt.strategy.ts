import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, JwtFromRequestFunction } from "passport-jwt";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtPayload } from "@/modules/auth/interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";
import { Patient } from "@/entities/patient.entity";

const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
  return request.signedCookies["token"]!;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): Promise<Patient> {
    return this.authService.verifyPayload(payload);
  }
}

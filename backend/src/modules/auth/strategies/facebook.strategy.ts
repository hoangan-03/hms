import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("FACEBOOK_APP_ID"),
      clientSecret: configService.get<string>("FACEBOOK_APP_SECRET"),
      callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL"),
      profileFields: ["id", "emails", "name"],
      scope: ["email"],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails } = profile;

    const email =
      emails && emails.length > 0
        ? emails[0].value
        : `${profile.id}@facebook.com`;

    const user = await this.authService.validateOrCreateFacebookUser({
      email: email,
      firstName: name.givenName,
      lastName: name.familyName,
      provider: "facebook",
      providerId: profile.id,
    });

    done(null, user);
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "@/modules/auth/dtos/register-user.dto";
import { JwtPayload } from "@/modules/auth/interfaces/jwt-payload.interface";
import { AuthTokenResponseDto } from "@/modules/auth/dtos/auth-token-response.dto";
import { AuthConstant } from "@/modules/auth/constant";

import { PatientService } from "../patient/patient.service";
import { Patient } from "@/entities/patient.entity";
import { checkPassword, hashPassword } from "@/utils/hash-password";

@Injectable()
export class AuthService {
  constructor(
    private readonly patientService: PatientService,
    private readonly jwtService: JwtService
  ) {}


  async register(signUp: RegisterUserDto): Promise<Patient> {
    try {
      const hashedPassword = await hashPassword(signUp.password);
      const user = await this.patientService.create({
        ...signUp,
        password: hashedPassword,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error && (error as any).code === "23505") {
          throw new BadRequestException("Email or username already exists.");
        }
        throw new InternalServerErrorException(
          error.message || "Registration failed."
        );  
      }
      throw new InternalServerErrorException("An unexpected error occurred.");
    }
  }

  async login(username: string, password: string): Promise<AuthTokenResponseDto> {
    let user: Patient;

    try {
      user = await this.patientService.getOne({ where: { username } });
    } catch (err) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    if (!(await checkPassword(password, user.password || ""))) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    return this.generateTokens(user);
  }

  generateTokens(user: Patient): AuthTokenResponseDto {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: AuthConstant.ACCESS_TOKEN_EXPIRATION,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: AuthConstant.REFRESH_TOKEN_EXPIRATION,
    });

    return {
      data: {
        access_token,
        refresh_token,
      },
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<Patient> {
    let user: Patient;

    try {
      user = await this.patientService.getOne({
        where: { id: Number(payload.sub) },
      });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with ID: ${payload.sub}`
      );
    }

    return user;
  }

  // async signToken(user: User | any): Promise<string> {
  //   if (!user) {
  //     throw new UnauthorizedException("Invalid user data: Missing user object");
  //   }

  //   if (user.id === undefined || user.id === null) {
  //     throw new UnauthorizedException("Invalid user data: Missing user ID");
  //   }

  //   const payload: JwtPayload = {
  //     sub: user.id.toString(),
  //     email: user.email || "",
  //     username: user.username || "",
  //     iat: Date.now(),
  //     exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  //   };

  //   return this.jwtService.sign(payload);
  // }
}

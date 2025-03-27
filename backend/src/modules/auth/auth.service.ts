import { Response } from "express";
import {
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
import { RegisterUserResponseDto } from "./dtos/register-user-response.dto";
import { DoctorService } from "../doctor/doctor.service";
import { Doctor } from "@/entities/doctor.entity";
import { Role } from "@/modules/auth/enums/role.enum";
import { GoogleUserData } from "./interfaces/google-user.interface";
import { FacebookUserData } from "./interfaces/facebook-user.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    signUp: RegisterUserDto,
    response: Response
  ): Promise<RegisterUserResponseDto> {
    try {
      const hashedPassword = await hashPassword(signUp.password);
      const user: Patient = await this.patientService.create({
        ...signUp,
        password: hashedPassword,
      });
      return new RegisterUserResponseDto(user.username);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || "Registration failed."
      );
    }
  }

  async login(
    user: Patient | Doctor,
    response: Response
  ): Promise<AuthTokenResponseDto> {
    const tokens = this.generateTokens(user);
    this.setAuthCookies(response, tokens);
    return tokens;
  }

  generateTokens(user: Patient | Doctor): AuthTokenResponseDto {
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

  setAuthCookies(response: Response, tokens: AuthTokenResponseDto): void {
    response.cookie("token", tokens.data.access_token, {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    response.setHeader("Authorization", `Bearer ${tokens.data.access_token}`);
  }

  async verifyPayload(payload: JwtPayload): Promise<Patient | Doctor> {
    const userId = Number(payload.sub);
    const role = payload.role;

    try {
      if (role === Role.DOCTOR) {
        return await this.doctorService.getOne({ where: { id: userId } });
      } else {
        return await this.patientService.getOne({ where: { id: userId } });
      }
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with ID: ${payload.sub}`
      );
    }
  }

  async validateUser(
    username: string,
    password: string
  ): Promise<Patient | Doctor> {
    let user: Patient | Doctor;

    try {
      try {
        user = await this.patientService.getOne({ where: { username } });
      } catch (err) {
        try {
          user = await this.doctorService.getOne({ where: { username } });
        } catch (err) {
          throw new UnauthorizedException(`Invalid credentials`);
        }
      }
      if (!(await checkPassword(password, user.password || ""))) {
        throw new UnauthorizedException(`Invalid credentials`);
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException(`Invalid credentials`);
    }
  }

  getUserProfile(user: Patient | Doctor): Patient | Doctor {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Patient | Doctor;
  }

  logout(response: Response): { message: string } {
    // Clear authentication cookies
    response.clearCookie("token", {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Remove the authorization header
    response.removeHeader("Authorization");

    return { message: "Logged out successfully" };
  }

  async validateOrCreateGoogleUser(userData: GoogleUserData): Promise<Patient> {
    const { email, firstName, lastName } = userData;

    try {
      const user = await this.patientService.getOne({
        where: { username: email },
      });
      return user;
    } catch (error) {
      const randomPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10) +
        "A1@";

      const hashedPassword = await hashPassword(randomPassword);

      const newUser = await this.patientService.create({
        username: email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        role: Role.PATIENT,
      });

      return newUser;
    }
  }

  async googleLogin(
    user: Patient,
    response: Response
  ): Promise<AuthTokenResponseDto> {
    if (!user) {
      throw new UnauthorizedException("No user from Google");
    }

    const tokens = this.generateTokens(user);
    this.setAuthCookies(response, tokens);

    return tokens;
  }

  async validateOrCreateFacebookUser(
    userData: FacebookUserData
  ): Promise<Patient> {
    const { email, firstName, lastName, provider, providerId } = userData;

    try {
      const user = await this.patientService.getOne({
        where: { username: email },
      });
      return user;
    } catch (error) {
      const randomPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10) +
        "A1@";

      const hashedPassword = await hashPassword(randomPassword);

      // For future reference
      const metadata = {
        socialProvider: provider,
        socialProviderId: providerId,
      };

      const newUser = await this.patientService.create({
        username: email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        role: Role.PATIENT,
        // If have a metadata field in patient entity:
        // metadata: JSON.stringify(metadata)
      });

      return newUser;
    }
  }

  async facebookLogin(
    user: Patient,
    response: Response
  ): Promise<AuthTokenResponseDto> {
    if (!user) {
      throw new UnauthorizedException("No user from social login");
    }

    const tokens = this.generateTokens(user);
    this.setAuthCookies(response, tokens);

    return tokens;
  }
}

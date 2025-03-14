import { Response } from "express";
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
import { RegisterUserResponseDto } from "./dtos/register-user-response.dto";
import { DoctorService } from "../doctor/doctor.service";
import { Doctor } from "@/entities/doctor.entity";
import { Role } from "@/modules/auth/enums/role.enum";

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
      // Hash password and create user
      const hashedPassword = await hashPassword(signUp.password);
      const user = await this.patientService.create({
        ...signUp,
        password: hashedPassword,
      });

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Set auth cookies and headers
      this.setAuthCookies(response, tokens);

      // Return response DTO
      return new RegisterUserResponseDto(user.username);
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

  async login(
    user: Patient | Doctor,
    response: Response
  ): Promise<AuthTokenResponseDto> {
    const tokens = this.generateTokens(user);
    // Set auth cookies and headers
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
      // Try the appropriate service based on the role in the token
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

  async validateUser(username: string, password: string): Promise<Patient | Doctor> {
    let user: Patient | Doctor;
  
    try {
      // Try to find a patient first
      try {
        user = await this.patientService.getOne({ where: { username } });
      } catch (err) {
        // If not found, try to find a doctor
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

    // Remove the authorization header if present
    response.removeHeader("Authorization");

    return { message: "Logged out successfully" };
  }
}
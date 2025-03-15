import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "@/modules/auth/auth.service";
import { RegisterUserDto } from "@/modules/auth/dtos/register-user.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@/modules/auth/guards/local-auth.guard";
import { TokenInterceptor } from "@/modules/auth/interceptors/token.interceptor";
import { LoginUserDTO } from "@/modules/auth/dtos/login-user.dto";
import { AuthTokenResponseDto } from "@/modules/auth/dtos/auth-token-response.dto";
import { RegisterUserResponseDto } from "@/modules/auth/dtos/register-user-response.dto";
import { Patient } from "@/entities/patient.entity";
import { CurrentUser } from "./decorators/user.decorator";
import { Doctor } from "@/entities/doctor.entity";
import { GoogleAuthGuard } from "./guards/google-auth.guard";

@ApiTags("auth")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: RegisterUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  async register(
    @Body() signUp: RegisterUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<RegisterUserResponseDto> {
    return this.authService.register(signUp, response);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: "Login with email/username and password" })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  async login(
    @CurrentUser() user: Patient,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthTokenResponseDto> {
    if (!user) {
      throw new UnauthorizedException("Authentication failed");
    }
    return this.authService.login(user, response);
  }

  @Get("/me")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the current authenticated user",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  me(@CurrentUser() user: Patient | Doctor): Patient | Doctor {
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
    return this.authService.getUserProfile(user);
  }

  @Post("logout")
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout the current user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged out",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Logged out successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async logout(
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    return this.authService.logout(response);
  }

  // @Get("google")
  // @UseGuards(GoogleAuthGuard)
  // @ApiOperation({ summary: "Initiate Google OAuth login" })
  // googleAuth() {
  //   // Redirect to Google OAuth
  // }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Handle Google OAuth callback" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in with Google",
    type: AuthTokenResponseDto,
  })
  async googleAuthCallback(
    @CurrentUser() user: Patient,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.googleLogin(user, response);
  }
}

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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '@/modules/auth/auth.service';
import { RegisterUserDto } from '@/modules/auth/dto/register-user.dto';
import { JWTAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { SessionAuthGuard } from '@/modules/auth/guards/session-auth.guard';
import { TokenInterceptor } from '@/modules/auth/interceptors/token.interceptor';
import { LoginUserDTO } from '@/modules/auth/dto/login-user.dto';
import { AuthTokenResponseDto } from '@/modules/auth/dto/auth-token-response.dto';
import { RegisterUserResponseDto } from '@/modules/auth/dto/register-user-response.dto';
import { Patient } from '@/entities/patient.entity';
import { AuthPatient } from '../patient/decorators/patient.decorator';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: RegisterUserResponseDto 
  })
  @ApiResponse({ 
    status: 400,
    description: 'Bad Request - Invalid input data' 
  })
  async register(
    @Body() signUp: RegisterUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<RegisterUserResponseDto> {
    const user = await this.authService.register(signUp);
    
    // Use generateTokens instead of signToken
    const tokens = this.authService.generateTokens(user);
    
    // Set the token in cookies manually
    response.cookie('token', tokens.data.access_token, {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    response.setHeader('Authorization', `Bearer ${tokens.data.access_token}`);
    
    // Transform to DTO before returning
    return new RegisterUserResponseDto(user.username);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Login with email/username and password' })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: AuthTokenResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials' 
  })
  async login(@Body() credentials: { email: string; password: string }): Promise<AuthTokenResponseDto> {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current authenticated user',
    type: Patient 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  me(@AuthPatient() patient: Patient): Patient {
    return patient;
  }
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Max, MaxLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'User age',
    required: false
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    enum: Gender,
    enumName: 'Gender',
    example: Gender.MALE,
    description: 'User gender',
    required: false
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @MaxLength(20)
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: '30 Elm Street',
    description: 'User address',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;
}
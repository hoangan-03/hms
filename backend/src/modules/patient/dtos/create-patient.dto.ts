import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, MinLength, Matches } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreatePatientDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Patient full name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Patient username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Patient password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    example: 30,
    description: 'Patient age',
  })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Patient gender',
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    example: '+1234567890',
    description: 'Patient phone number',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Patient address',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

import {
    IsDefined,
    IsNotEmpty,

    MinLength,

  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

  export class RegisterUserResponseDto {
    @ApiProperty({ 
      example: 'testuser',
      description: 'Username for registration'
    })
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    readonly username: string;


    constructor(username: string) {
      this.username = username;
    }
  }
  
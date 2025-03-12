import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class LoginUserDTO {
  @ApiProperty({
    example: "username123",
    description: "Username",
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    example: "Password123@",
    description: "Password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

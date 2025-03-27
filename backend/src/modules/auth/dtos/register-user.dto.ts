import {
  IsDefined,
  IsNotEmpty,
  MinLength,
  Validate,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsUserNameAlreadyExist } from "../../patient/validators/is-username-already-exist.validator";

export class RegisterUserDto {
  @ApiProperty({
    example: "testuser",
    description: "Username for registration",
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, {
    message: "Username must be at least 3 characters long",
  })
  @Validate(IsUserNameAlreadyExist)
  readonly username: string;

  @ApiProperty({
    example: "Password123@",
    description: "Password min 8 characters",
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  readonly password: string;
}

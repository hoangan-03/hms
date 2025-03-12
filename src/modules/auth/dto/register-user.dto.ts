import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsUserNameAlreadyExist } from "../../../modules/patient/validators/is-username-already-exist.validator";
export class RegisterUserDto {
  @ApiProperty({
    example: "testuser",
    description: "Username for registration",
  })
  @IsDefined()
  @IsNotEmpty()
  // @Validate(IsUserNameAlreadyExist)
  readonly username: string;

  @ApiProperty({
    example: "Password123@",
    description: "Password min 8 characters",
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character",
  })
  readonly password: string;
}

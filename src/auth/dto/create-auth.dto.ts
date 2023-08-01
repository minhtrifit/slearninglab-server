import { IsNotEmpty, IsString, IsEnum, IsEmail } from 'class-validator';
import { Roles } from 'src/utils/roles.enum';

export class registerAccountDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Roles)
  role: string;
}

export class verifyEmailDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  checkCode: string;
}

export class loginAccountDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

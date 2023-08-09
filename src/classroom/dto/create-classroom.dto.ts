import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class createClassDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;
}

import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class createClassDto {
  @IsNotEmpty()
  @IsString()
  teacherUsername: string;

  @IsNotEmpty()
  @IsString()
  className: string;

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

  @IsNotEmpty()
  @IsDate()
  dateCreated: Date;
}

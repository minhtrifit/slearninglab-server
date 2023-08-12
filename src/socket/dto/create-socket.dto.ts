import { IsNotEmpty, IsString } from 'class-validator';

export class userConnectDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class joinClassDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  teacherUsername: string;

  @IsNotEmpty()
  @IsString()
  classId: string;
}

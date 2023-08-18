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

export class acceptJoinClass {
  @IsNotEmpty()
  @IsString()
  userJoinedUsername: string;

  @IsNotEmpty()
  @IsString()
  teacherUsername: string;

  @IsNotEmpty()
  @IsString()
  className: string;

  @IsNotEmpty()
  @IsString()
  classId: string;
}

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  room: string;
}

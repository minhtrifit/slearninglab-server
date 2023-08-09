import { IsNotEmpty, IsString } from 'class-validator';

export class userConnectDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

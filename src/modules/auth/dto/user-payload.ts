import { IsNotEmpty, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

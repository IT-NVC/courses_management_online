import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}

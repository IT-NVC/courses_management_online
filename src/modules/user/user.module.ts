import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../schemas/user.schema';
import { UserRepository } from '../../repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EnrollmentRepository } from 'src/repositories/enrollment.repository';
import { Enrollment, EnrollmentSchema } from 'src/schemas/enrollment.schema';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Enrollment.name, schema: EnrollmentSchema }]),
    CourseModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository,EnrollmentRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}

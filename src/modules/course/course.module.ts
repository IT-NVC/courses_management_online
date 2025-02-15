import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { CourseRepository } from 'src/repositories/course.repository';
import { EnrollmentRepository } from 'src/repositories/enrollment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from 'src/schemas/enrollment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Course]),MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),],
  controllers: [CourseController],
  providers: [CourseService,CourseRepository, EnrollmentRepository],
  exports: [CourseService],
})
export class CourseModule {}

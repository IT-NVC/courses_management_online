import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import e from 'express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EnrollmentRepository } from 'src/repositories/enrollment.repository';
import { CourseService } from '../course/course.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseService: CourseService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    //check if username already exists
    const userSameUsername = await this.userRepository.getUserByConditionl({
      username: createUserDto.username,
    });
    if (userSameUsername) {
      throw new ConflictException('Username already exists');
    }

    const createdUser = await this.userRepository.createUser({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return createdUser;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  //update user about username and email
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //check if email already exists
    const uesrSameEmail = await this.userRepository.getUserByConditionl({
      email: updateUserDto.email,
    });
    if (uesrSameEmail && uesrSameEmail._id.toString() !== id.toString()) {
      throw new ConflictException('Email already exists');
    }

    //check if username already exists
    const userSameUsername = await this.userRepository.getUserByConditionl({
      username: updateUserDto.username,
    });
    if (userSameUsername && userSameUsername._id.toString() !== id.toString()) {
      throw new ConflictException('Username already exists');
    }

    return await this.userRepository.updateUser(id, {
      username: updateUserDto.username,
      email: updateUserDto.email,
    });
  }

  async registerEnrollment(userId: string, courseId: number) {
    await this.courseService.getCourseById(courseId);
    const enrollment =
      await this.enrollmentRepository.getEnrollmentByUserIdAndCourseId(
        userId,
        courseId,
      );
    if (enrollment) {
      if (enrollment.status === 'enrolled') {
        throw new NotFoundException('You have registered for the course.');
      } else {
        return await this.enrollmentRepository.updateEnrollment(
          enrollment._id,
          'enrolled',
        );
      }
    }
    return await this.enrollmentRepository.createEnrollment({
      userId,
      courseId,
      status: 'enrolled',
    });
  }

  async cancelEnrollment(userId: string, courseId: number) {
    await this.courseService.getCourseById(courseId);
    const enrollment =
      await this.enrollmentRepository.getEnrollmentByUserIdAndCourseId(
        userId,
        courseId,
      );

    if (enrollment.status === 'cancelled') {
      throw new BadRequestException('you cancelled course');
    }

    if (!enrollment) {
      throw new NotFoundException(
        'You have not registered for the course yet.',
      );
    }
    return await this.enrollmentRepository.updateEnrollment(
      enrollment._id,
      'cancelled',
    );
  }

  async getListCourseRegister(userId: string, page: number, limit: number) {
    const enrollments = await this.enrollmentRepository.getCoursesByUserId(
      userId,
      page,
      limit,
    );
    const courses = await this.courseService.getListCourseByIds(
      enrollments.data.map((item) => item.courseId),
    );
    enrollments.data.forEach((enrollment: any) => {
      const course = courses.find((item) => item?.id === enrollment?.courseId);
      enrollment.course = course || null;
    });

    return enrollments;
  }
}

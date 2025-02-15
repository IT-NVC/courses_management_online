import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository, In } from 'typeorm';

export class CourseRepository {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  //create course
  async createCourse(course: Course): Promise<Course> {
    try {
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteCourse(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOne({
        where:{
          id
        }
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      await this.courseRepository.delete(id);
      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCourseById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where:{
        id
      }
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async updateCourse(id: number, course: Course): Promise<any> {
    try {
      return await this.courseRepository.update(id, course);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async getCourses(page: number = 1, limit: number = 10) {
    const [data, total] = await this.courseRepository.findAndCount({
      select:{title:true,id:true},
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }


  async getCourseByIds(ids: Array<number>): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      where:{
        id: In(ids)
      }
    });
    return courses;
  }
  
}

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CourseRepository } from 'src/repositories/course.repository';
import { EnrollmentRepository } from 'src/repositories/enrollment.repository';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  //CREATE COURSE
  async createCourse(id:string,course: any): Promise<any> {
    return await this.courseRepository.createCourse({...course,creatorId:id});
  }


  async deleteCourse(id: number,user:any) {
    const course = await this.courseRepository.getCourseById(id);

    if(`${course.creatorId}` !== `${user._id}`){
      throw new UnauthorizedException('You are not authorized to delete this course');
    }

    return await this.courseRepository.deleteCourse(id);
  }

  async getCourseByIdForUser(id: number,userId:string): Promise<any> {
    const course =  await this.courseRepository.getCourseById(id);

    if(course.creatorId === userId){
      return course
    }

    const enrollment = await this.enrollmentRepository.getEnrollmentByUserIdAndCourseId(userId,id)
    if(!enrollment || enrollment.status ==='cancelled'){
      throw new BadRequestException('You cannot view course details')
    }
    
    return course
  }

  async getCourseById(id:number){
    return await this.courseRepository.getCourseById(id);
  }

  async updateCourse(id: number, course: any,user:any): Promise<any> {
    const courseExist = await this.courseRepository.getCourseById(id);
    if(!courseExist){
      throw new NotFoundException('Course not found');
    }

    if(`${courseExist.creatorId}` !== `${user._id}`){
      throw new UnauthorizedException('You are not authorized to update this course');
    }

    return await this.courseRepository.updateCourse(id, course);
  }
  

  async getListCourse(page:number,limit:number){
    return await this.courseRepository.getCourses(page,limit)
  }

  async getListCourseByIds(ids:Array<number>){
    return await this.courseRepository.getCourseByIds(ids)
  }
}

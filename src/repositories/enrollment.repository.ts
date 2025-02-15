
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterEnrollmentDto } from 'src/modules/user/dto/register-enrollment';
import { Enrollment } from 'src/schemas/enrollment.schema';
import { ObjectId } from 'mongodb';

export class EnrollmentRepository {
  constructor(
       @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
  ) {}

  //create enrollment
   async createEnrollment(createEnrollment: RegisterEnrollmentDto) {

      const enrollment = new this.enrollmentModel({
       ...createEnrollment,
       status:'enrolled'
      });
  
      let newEnrollment: any = await enrollment.save({ validateBeforeSave: true });
      
      if(newEnrollment) {
        newEnrollment._id = newEnrollment?._id.toString();
      }
      
      return newEnrollment;
    }
  

    //update enrollment
    async updateEnrollment(id:string, status:string) {
      let enrollment;
    try {
      enrollment = await this.enrollmentModel
        .findByIdAndUpdate(
          { _id: new ObjectId(id) },
          { status: status },
          { new: true, runValidators: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!enrollment) {
      throw new NotFoundException('User not found');
    }

    enrollment._id = enrollment._id.toString();
    return enrollment;
    }


    //get enrollment by userId and courseId
    async getEnrollmentByUserIdAndCourseId(userId:string, courseId:number){
      let enrollment;
      try {
        enrollment = await this.enrollmentModel.findOne({ userId,courseId }).lean().exec();
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
  
      if(enrollment) enrollment._id = enrollment?._id?.toString();
      return enrollment;
    }

    async getCoursesByUserId(userId:string, page: number = 1, limit: number = 10) {
      const skip = (page - 1) * limit;
  
      const [data, total] = await Promise.all([
        this.enrollmentModel.find({userId}).skip(skip).limit(limit).lean().exec(),
        this.enrollmentModel.countDocuments(),
      ]);
  
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
    }
}

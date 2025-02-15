import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import { ObjectId } from 'mongodb';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserByConditionl(condition:any) {
    let user;
    try {
      user = await this.userModel.findOne({ ...condition }).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if(user) user._id = user?._id?.toString();
    return user;
  }

  async getUserByEmail(email: string) {
    let user;
    try {
      user = await this.userModel.findOne({ email }).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if(user) user._id = user._id.toString();
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    let user = await this.getUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    user = new this.userModel({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    try {
      user = await user.save({ validateBeforeSave: true });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new ConflictException('User not created');
    }

    user._id = user._id.toString();
    return user;
  }

  async updateUser(id: string, updateUserDto: any) {
    let user;
    try {
      user = await this.userModel
        .findByIdAndUpdate(
          { _id: new ObjectId(id) },
          { ...updateUserDto },
          { new: true, runValidators: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user._id = user._id.toString();
    return user;
  }

  async getUserById(id: string) {
    let user;
    try {
      user = await this.userModel.findById(new ObjectId(id)).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user._id = user._id.toString();
    return user;
  }
}

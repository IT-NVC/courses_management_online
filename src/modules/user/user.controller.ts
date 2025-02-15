import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get user infomation' })
  @ApiResponse({
    status: 200,
    description: 'User information',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Get('/get-info')
  async getCompanyById(@Res() res: Response, @Req() req: any) {
    const userRequest = req.user;
    delete userRequest.password;
    return res.status(HttpStatus.OK).send(userRequest);
  }

  //api update user with email and user name
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User update successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Patch('/updateUser')
  async updateUser(
    @Body() updateUserDto: any,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userRequest = req.user;
    const user: any = await this.userService.updateUser(userRequest._id, {
      username: updateUserDto.username || userRequest.username,
      email: updateUserDto.email || userRequest.email,
    });
    return res.status(HttpStatus.OK).send(user);
  }

  //User Register course
  @ApiOperation({ summary: 'User register course' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        courseId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User register successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Post('/register-course')
  async registerCourse(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userRequest = req.user;
    const createEnrollment = await this.userService.registerEnrollment(
      userRequest._id,
      body.courseId,
    );
    return res.status(HttpStatus.OK).send(createEnrollment);
  }

  //User Register course
  @ApiOperation({ summary: 'User cancel course' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        courseId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User cancel successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Post('/cancel-course')
  async cancelCourse(@Body() body: any, @Res() res: Response, @Req() req: any) {
    const userRequest = req.user;
    const cancelEnrollment = await this.userService.cancelEnrollment(
      userRequest._id,
      body.courseId,
    );
    return res.status(HttpStatus.OK).send(cancelEnrollment);
  }

  //User Register course
  @ApiOperation({ summary: 'User get list course registered' })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Get('/get-list-course-registered')
  async getListCourseRegister(
    @Res() res: Response,
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userRequest = req.user;
    const cancelEnrollment = await this.userService.getListCourseRegister(
      userRequest._id,
      page,
      limit,
    );
    return res.status(HttpStatus.OK).send(cancelEnrollment);
  }
}

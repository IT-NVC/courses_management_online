import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto';

@Controller('course')
@ApiTags('Course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  //api create course body about title, description, content
  @ApiOperation({ summary: 'Create course' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['title', 'description', 'content'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Course create successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Post('/createCourse')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const user = req.user;
    const course = await this.courseService.createCourse(user._id,createCourseDto);
    return res.status(HttpStatus.OK).send(course);
  }

  //delete course by id
  @ApiOperation({ summary: 'Delete course' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Course id',
  })
  @ApiResponse({
    status: 200,
    description: 'Course delete successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Delete('/deleteCourse/:id')
  async deleteCourse(@Res() res: Response, @Param('id') id: number, @Req() req: any,) {
    const user = req.user;
    await this.courseService.deleteCourse(id,user);
    return res.status(HttpStatus.OK).send({
      message: 'Course deleted successfully',
    });
  }


  //update course by id
  @ApiOperation({ summary: 'Update course' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Course id',
  })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Course update successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Patch('/updateCourse/:id')
  async updateCourse(
    @Body() updateCourseDto: CreateCourseDto,
    @Res() res: Response,
    @Param('id') id: number,
    @Req() req: any,
  ) {
    const user = req.user;
    const course = await this.courseService.updateCourse(id, updateCourseDto, user);
    return res.status(HttpStatus.OK).send({
      message: 'Course updated successfully',
    });
  }
  

  //get course by id
  @ApiOperation({ summary: 'Get course by id' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Course id',
  })
  @ApiResponse({
    status: 200,
    description: 'Course information',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth('access-token')
  @Get('/getCourseById/:id')
  async getCourseById(@Res() res: Response, @Param('id') id: number, @Req() req: any,
) {
    const user = req.user;
    const course = await this.courseService.getCourseByIdForUser(id,user._id);
    return res.status(HttpStatus.OK).send(course);
  }
  

  //api get list course have paginate
   @ApiOperation({ summary: 'Get course by id' })
   @ApiResponse({
     status: 200,
     description: 'Course information',
   })
   @ApiResponse({ status: 400, description: 'Invalid input' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   @ApiResponse({ status: 500, description: 'Server error' })
   @ApiQuery({ name: 'page', required: false, type: Number, example: 1, })
   @ApiQuery({ name: 'limit', required: false, type: Number, example: 10,  })
   @Get('/')
   async getListCourse(@Res() res: Response,@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
     const course = await this.courseService.getListCourse(page,limit);
     return res.status(HttpStatus.OK).send(course);
   }
}

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User create successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('/sign-up')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const newUser: any = await this.userService.createUser(createUserDto);
      delete newUser['password'];
      const accessToken =
        await this.authService.generateAccessTokenUser(newUser);
      return res.status(HttpStatus.CREATED).send(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //create api for login
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    description: 'body information',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User login',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const user: any = await this.userService.getUserByEmail(loginDto.email);
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Invalid email or password');
      }
      delete user['password'];
      const accessToken = await this.authService.generateAccessTokenUser(user);
      return res.status(HttpStatus.OK).send({ user, accessToken });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

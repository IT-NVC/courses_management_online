import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from './dto/user-payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  generateAccessTokenUser(user: UserPayloadDto) {
    console.log(process.env.USER_SECRET_KEY)
    const jwtToken = this.jwtService.sign(
      { _id: user._id.toString(), username: user.username, email: user.email },
      {
        secret: process.env.USER_SECRET_KEY,
        expiresIn: '1d',
      },
    );
    return jwtToken;
  }

  decodeAccessToken(token: string) {
    const decode = this.jwtService.verify(token, {
      secret: process.env.USER_SECRET_KEY,
    });
    return decode;
  }
}

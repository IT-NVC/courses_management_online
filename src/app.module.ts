import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule as ConfigDatabaseModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService as ConfigDatabaseService } from 'src/config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { UserAuthMiddleware } from './middleware/user-auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/course.module';
import { CourseController } from './modules/course/course.controller';
import { UserController } from './modules/user/user.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ConfigDatabaseModule,
    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigDatabaseService],
      useFactory: async (configService: ConfigDatabaseService) =>
        configService.getMongoConfig(),
    }),
    // MySQL Connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigDatabaseService],
      useFactory: async (configService: ConfigDatabaseService) =>
        configService.getMysqlConfig(),
    }),
    UserModule,
    AuthModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      consumer.apply(UserAuthMiddleware).exclude(
        { path: 'user/getUser/:id', method: RequestMethod.GET },      
      ).forRoutes(UserController)
    consumer.apply(UserAuthMiddleware).exclude(
      { path: 'course', method: RequestMethod.GET }
    
    ).forRoutes(CourseController)
  }
}

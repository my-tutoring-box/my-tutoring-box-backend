import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { LessonModule } from './lesson/lesson.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    StudentModule,
    LessonModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

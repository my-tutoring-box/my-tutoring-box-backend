import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { LessonsModule } from './lessons/lessons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    StudentsModule,
    LessonsModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

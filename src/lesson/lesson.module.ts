import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Lesson,
  LessonSchema,
} from 'src/libs/shared/src/schemas/lesson.schema';
import {
  Student,
  StudentSchema,
} from 'src/libs/shared/src/schemas/student.schema';
import {
  Calendar,
  CalendarSchema,
} from 'src/libs/shared/src/schemas/calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}

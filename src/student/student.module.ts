import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Student,
  StudentSchema,
} from 'src/libs/shared/src/schemas/student.schema';
import {
  Lesson,
  LessonSchema,
} from 'src/libs/shared/src/schemas/lesson.schema';
import {
  Calendar,
  CalendarSchema,
} from 'src/libs/shared/src/schemas/calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}

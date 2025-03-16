import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calendar } from 'src/libs/shared/src/schemas/calendar.schema';
import { Lesson } from 'src/libs/shared/src/schemas/lesson.schema';
import { Student } from 'src/libs/shared/src/schemas/student.schema';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async findLesson(studentId: string) {
    const student = await this.studentModel.findById(studentId);
    const lessons = await this.lessonModel
      .find({ studentId })
      .populate<{ calendarId: Calendar }>('calendarId')
      .lean();

    const lesson = lessons.find(
      (lesson) => lesson.calendarId.count === student?.count,
    );

    return lesson;
  }

  async setLesson(lessonId: string, body: LessonDto) {
    return await this.lessonModel.findByIdAndUpdate(
      lessonId,
      {
        content: body.content,
        homework: body.homework,
      },
      { new: true },
    );
  }
}

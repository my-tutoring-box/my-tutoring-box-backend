import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calendar } from 'src/libs/shared/src/schemas/calendar.schema';
import { Lesson } from 'src/libs/shared/src/schemas/lesson.schema';
import { Student } from 'src/libs/shared/src/schemas/student.schema';
import { LessonDto } from './dto/lesson.dto';
import { getStudentCycle } from 'src/utils/schedule.util';
import { format } from 'date-fns';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,

    @InjectModel(Calendar.name)
    private readonly calendarModel: Model<Calendar>,
  ) {}

  async findCurrentLesson(studentId: string) {
    const student = await this.studentModel.findById(studentId);
    if (!student) return;

    const lessons = await this.lessonModel
      .find({ studentId })
      .populate<{ calendarId: Calendar }>('calendarId')
      .lean();

    const sortedLessons = lessons.sort(
      (a, b) =>
        new Date(b.calendarId.date).getTime() -
        new Date(a.calendarId.date).getTime(),
    );

    console.log(lessons);
    const cycle = getStudentCycle(student) - 1;

    const lesson = lessons.find(
      (lesson) =>
        lesson.calendarId.count ===
        student?.count - cycle * student?.frequency * 4,
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

  async setHomeworkComplete(lessonId: string, homeworkId: string) {
    return await this.lessonModel.findOneAndUpdate(
      {
        _id: lessonId,
        'homework._id': homeworkId,
      },
      {
        $bit: { 'homework.$.complete': { xor: 1 } },
      } as any,
      { new: true },
    );
  }

  async summaryLessons(studentId: string) {
    const student = await this.studentModel.findById(studentId);
    if (student == null) return;

    const cycle = getStudentCycle(student);
    const calendars = await this.calendarModel
      .find({ studentId, cycle: cycle - 1 })
      .sort({ count: 1 });

    const rawData = await Promise.all(
      calendars.map(async (c) => {
        return await this.lessonModel
          .findOne({ calendarId: c._id })
          .populate('calendar');
      }),
    );

    const data = rawData.map((d) => ({
      date: d?.calendar?.date
        ? format(new Date(d.calendar.date), 'MM월 dd일')
        : null,
      content: d?.content,
    }));
    return {
      data,
      account: student.account,
      fee: student.fee,
      name: student.name,
      cycle: getStudentCycle(student) - 1,
    };
  }
}

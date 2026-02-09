import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,

    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,

    @InjectModel(Calendar.name)
    private readonly calendarModel: Model<Calendar>,
  ) {}

  async findCurrentLesson(studentId: string) {
    const cacheKey = `lesson:current:${studentId}`;
    console.log('[Cache] store:', (this.cacheManager as any).store?.name);
    console.log(`[Cache] Checking for key: ${cacheKey}`);
    const cached = await this.cacheManager.get<Lesson>(cacheKey);
    if (cached) {
      console.log(`[Cache] Hit!`);
      return cached;
    }

    const student = await this.studentModel
      .findById(studentId)
      .select('count frequency');
    if (!student) return;

    const cycle = getStudentCycle(student);
    const targetCount = student.count + 1 - (cycle - 1) * student.frequency * 4;

    const calendar = await this.calendarModel.findOne({
      studentId,
      cycle,
      count: targetCount,
    });
    if (!calendar) return;

    const lesson = await this.lessonModel
      .findOne({ calendarId: calendar._id })
      .populate({
        path: 'calendarId',
        select: 'date count cycle',
      })
      .select('content homework calendarId')
      .lean();

    if (lesson) {
      await this.cacheManager.set(cacheKey, lesson);
      console.log(`[Cache] Data saved to Redis.`);
    }
    return lesson;
  }

  async setLesson(studentId: string, lessonId: string, body: LessonDto) {
    const result = await this.lessonModel.findByIdAndUpdate(
      lessonId,
      {
        content: body.content,
        homework: body.homework,
      },
      { new: true },
    );
    await this.cacheManager.del(`lesson:current:${studentId}`);
    return result;
  }

  async setHomeworkComplete(
    studentId: string,
    lessonId: string,
    homeworkId: string,
  ) {
    const result = await this.lessonModel.findOneAndUpdate(
      {
        _id: lessonId,
        'homework._id': homeworkId,
      },
      {
        $bit: { 'homework.$.complete': { xor: 1 } },
      } as any,
      { new: true },
    );
    await this.cacheManager.del(`lesson:current:${studentId}`);
    return result;
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

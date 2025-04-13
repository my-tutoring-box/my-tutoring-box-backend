import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { Model, Types } from 'mongoose';
import { Calendar } from 'src/libs/shared/src/schemas/calendar.schema';
import { Lesson } from 'src/libs/shared/src/schemas/lesson.schema';
import {
  Student,
  StudentDocument,
} from 'src/libs/shared/src/schemas/student.schema';
import {
  createSchedule,
  getDayNumber,
  getNextLessonDate,
  getStudentCycle,
} from 'src/utils/schedule.util';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
    @InjectModel(Calendar.name)
    private readonly calendarModel: Model<Calendar>,
  ) {}

  async addCalendars(student: StudentDocument) {
    let schedule = createSchedule(student);
    const calendars = await this.calendarModel.insertMany(schedule);
    await this.lessonModel.insertMany(
      calendars.map(({ studentId, id }) => ({ studentId, calendarId: id })),
    );
  }

  async addStudent(body: Student) {
    const randNum = Math.floor(Math.random() * 1000000).toString();
    body.code = randNum;
    const student = await this.studentModel.create(body);
    this.addCalendars(student);

    return student;
  }

  async findAll() {
    return await this.studentModel.find();
  }

  async getMonthlyCalendars() {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const calendars = await this.calendarModel.find({
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });

    return calendars;
  }

  async getStudentCalendars(studentId: string) {
    const student = await this.studentModel.findById(studentId);
    if (student == null) return;

    const cycle = getStudentCycle(student);
    return await this.calendarModel
      .find({ cycle, studentId })
      .sort({ count: 1 });
  }

  @Cron('0 0 * * *')
  async ManageSchedule() {
    console.log('🔄 Running daily student schedule update...');

    const students = await this.studentModel.find();

    for (const student of students) {
      await this.updateCalendars(student.id);
    }

    console.log('✅ Daily student schedule update completed.');
  }

  async updateCalendars(studentId: string) {
    const calendar = await this.calendarModel.findOne(
      {
        studentId,
        date: { $gte: new Date() },
      },
      { count: 1 },
    );

    if (calendar) {
      await this.studentModel.findByIdAndUpdate(
        studentId,
        {
          count: calendar?.count,
        },
        { new: true },
      );
    } else {
      const student = await this.studentModel.findById(studentId);
      if (!student) return;

      const lessonDay = getDayNumber(student.time[0].day);
      const now = new Date();
      const today = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          12,
          0,
          0,
        ),
      );

      const nextLessonDate = getNextLessonDate(today, lessonDay);
      await this.studentModel.findByIdAndUpdate(
        studentId,
        { startDate: nextLessonDate },
        { new: true },
      );

      this.addCalendars(student);
    }
  }
}

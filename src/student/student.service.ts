import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Model, Types } from 'mongoose';
import { Calendar } from 'src/libs/shared/src/schemas/calendar.schema';
import { Lesson } from 'src/libs/shared/src/schemas/lesson.schema';
import { Student } from 'src/libs/shared/src/schemas/student.schema';
import { createSchedule } from 'src/utils/schedule.util';

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

  async addStudent(body: Student) {
    const randNum = Math.floor(Math.random() * 1000000).toString();
    body.code = randNum;
    const student = await this.studentModel.create(body);

    let schedule = createSchedule(student);
    const calendars = await this.calendarModel.insertMany(schedule);
    await this.lessonModel.insertMany(
      calendars.map(({ studentId, id }) => ({ studentId, calendarId: id })),
    );

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

    const cycle = Math.floor(student.count / (student.frequency * 4)) + 1;
    return await this.calendarModel.find({ cycle });
  }

  @Cron('0 0 * * *')
  async updateAllStudentsCount() {
    console.log('🔄 Running daily student count update...');

    const students = await this.studentModel.find();

    for (const student of students) {
      await this.setCount(student.id);
    }

    console.log('✅ Daily student count update completed.');
  }

  async setCount(studentId: string) {
    const calendar = await this.calendarModel.findOne(
      {
        studentId,
        date: { $gte: new Date() },
      },
      { count: 1 },
    );
    return await this.studentModel.findByIdAndUpdate(
      studentId,
      {
        count: calendar?.count,
      },
      { new: true },
    );
  }
}

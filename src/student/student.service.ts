import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}

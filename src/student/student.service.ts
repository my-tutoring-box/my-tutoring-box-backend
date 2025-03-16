import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/libs/shared/src/schemas/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async addStudent(student: Student) {
    const randNum = Math.floor(Math.random() * 1000000).toString();
    student.code = randNum;
    return await this.studentModel.create(student);
  }
}

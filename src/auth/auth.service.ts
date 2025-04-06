import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/libs/shared/src/schemas/student.schema';
import { User } from 'src/libs/shared/src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async register(user: User) {
    const student = await this.studentModel.findOne({
      code: user.email.slice(0, 6),
    });
    if (user.role !== 'teacher' && student) user['studentId'] = student.id;

    return (await this.userModel.findOne({ email: user.email }))
      ? this.login(user)
      : await this.userModel.create(user);
  }

  async login(user: User) {
    const findedUser = await this.userModel.findOne({ email: user.email });
    const data = user.password === findedUser?.password ? findedUser : null;
    return data;
  }
}

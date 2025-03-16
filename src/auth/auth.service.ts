import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/libs/shared/src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async register(user: User) {
    return await this.userModel.create(user);
  }

  async login(user: User) {
    const findedUser = await this.userModel.findOne({ email: user.email });
    const data = user.password === findedUser?.password ? findedUser : null;
    return data;
  }
}

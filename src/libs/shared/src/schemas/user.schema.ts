import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const UserTypes = ['teacher', 'student', 'parents'] as const;
type UserType = (typeof UserTypes)[number];

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: String, enum: UserTypes })
  role?: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

const DayTypes = ['월', '화', '수', '목', '금', '토', '일'] as const;
type DayType = (typeof DayTypes)[number];

const SchoolTypes = ['중학교', '고등학교', '대학교'] as const;
type SchoolType = (typeof SchoolTypes)[number];

const GradeTypes = ['1학년', '2학년', '3학년', '4학년'] as const;
type GradeType = (typeof GradeTypes)[number];

class TimeRange {
  @Prop({ required: true })
  start: string; // "HH:mm"

  @Prop({ required: true })
  end: string; // "HH:mm"
}

class TimeSlot {
  @Prop({ required: true, enum: DayTypes, type: String })
  day: DayType;

  @Prop({ required: true })
  range: TimeRange;
}

class AccountInfo {
  @Prop({ required: true })
  bank: string;

  @Prop({ required: true })
  accountNumber: string;
}

@Schema({
  collection: 'students',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: SchoolTypes, type: String })
  schoolLevel: SchoolType;

  @Prop({ enum: GradeTypes, type: String })
  grade: GradeType;

  @Prop()
  schoolName: string;

  @Prop()
  address: string;

  @Prop({ required: true, type: [TimeSlot] })
  time: TimeSlot[];

  @Prop({ required: true })
  frequency: number;

  @Prop()
  fee: number;

  @Prop({ type: AccountInfo })
  account: AccountInfo;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ unique: true })
  code?: string;

  @Prop({ default: 1 })
  count: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

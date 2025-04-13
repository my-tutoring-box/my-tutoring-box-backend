import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Calendar } from './calendar.schema';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema()
export class Homework {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: Number, enum: [0, 1], default: 0 })
  complete?: number;

  _id?: Types.ObjectId;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);

@Schema({
  collection: 'lessons',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Lesson {
  @Prop({ default: '' })
  content?: string;

  @Prop({ type: [HomeworkSchema] })
  homework?: Homework[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Student',
    required: true,
  })
  studentId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Calendar', required: true })
  calendarId: Types.ObjectId | Calendar;

  @Virtual({
    options: {
      ref: Calendar.name,
      localField: 'calendarId',
      foreignField: '_id',
      justOne: true,
    },
  })
  calendar?: Calendar;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

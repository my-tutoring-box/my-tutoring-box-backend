import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

class Homework {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  complete: string;
}

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
  @Prop()
  content?: string;

  @Prop({ type: [Homework] })
  homework?: Homework[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Student',
    required: true,
  })
  studentId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Calendar', required: true })
  calendarId: Types.ObjectId;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

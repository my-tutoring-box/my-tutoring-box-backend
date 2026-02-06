import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type CalendarDocument = HydratedDocument<Calendar>;

@Schema({
  collection: 'calendars',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Calendar {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true, default: 1 })
  cycle: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Student',
    required: true,
  })
  studentId: Types.ObjectId;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);

CalendarSchema.index({ studentId: 1, cycle: 1, count: 1 });

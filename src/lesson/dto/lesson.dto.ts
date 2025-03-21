import { Homework } from 'src/libs/shared/src/schemas/lesson.schema';

export class LessonDto {
  content: string;
  homework: Homework[];
}

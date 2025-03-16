import { Controller, Get, Param } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiSuccessResponse } from 'src/libs/shared/src/interfaces/api.interface';
import {
  Lesson,
  LessonDocument,
} from 'src/libs/shared/src/schemas/lesson.schema';

@Controller(':studentId/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getLesson(
    @Param('studentId') studentId: string,
  ): Promise<ApiSuccessResponse<Lesson>> {
    const lesson = await this.lessonService.findLesson(studentId);
    return {
      status: 'success',
      data: lesson,
    };
  }
}

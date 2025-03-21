import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiSuccessResponse } from 'src/libs/shared/src/interfaces/api.interface';
import { Lesson } from 'src/libs/shared/src/schemas/lesson.schema';
import { LessonDto } from './dto/lesson.dto';

@Controller(':studentId/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getLesson(
    @Param('studentId') studentId: string,
  ): Promise<ApiSuccessResponse<Lesson>> {
    const lesson = await this.lessonService.findCurrentLesson(studentId);
    return {
      status: 'success',
      data: lesson,
    };
  }

  @Patch(':lessonId')
  async setLesson(
    @Param('lessonId') lessonId: string,
    @Body() body: LessonDto,
  ): Promise<ApiSuccessResponse<Lesson | null>> {
    const lesson = await this.lessonService.setLesson(lessonId, body);
    return {
      status: 'success',
      data: lesson,
    };
  }

  @Patch(':lessonId/homeworks/:homeworkId')
  async setHomeworkComplete(
    @Param('lessonId') lessonId: string,
    @Param('homeworkId') homeworkId: string,
  ) {
    const lesson = await this.lessonService.setHomeworkComplete(
      lessonId,
      homeworkId,
    );
    return {
      status: 'success',
      data: lesson,
    };
  }
}

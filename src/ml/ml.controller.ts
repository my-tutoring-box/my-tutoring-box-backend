import { Controller, Post, Body } from '@nestjs/common';
import { MlService } from './ml.service';

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('predict')
  async predict(@Body('answers') answers: number[]) {
    return await this.mlService.predictStudentType(answers);
  }
}

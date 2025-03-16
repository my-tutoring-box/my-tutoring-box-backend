import { Body, Controller, Post } from '@nestjs/common';
import { ApiSuccessResponse } from 'src/libs/shared/src/interfaces/api.interface';
import { Student } from 'src/libs/shared/src/schemas/student.schema';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async addStudent(
    @Body() body: Student,
  ): Promise<ApiSuccessResponse<Student>> {
    const student = await this.studentService.addStudent(body);
    return {
      status: 'success',
      data: student,
    };
  }
}

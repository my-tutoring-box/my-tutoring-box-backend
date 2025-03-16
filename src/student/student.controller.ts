import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Get()
  async getAllStudents(): Promise<ApiSuccessResponse<Student[]>> {
    const students = await this.studentService.findAll();
    return {
      status: 'success',
      data: students,
    };
  }

  @Patch(':studentId/count')
  async setCount(
    @Param('studentId') studentId: string,
  ): Promise<ApiSuccessResponse<Student | null>> {
    const student = await this.studentService.setCount(studentId);
    return {
      status: 'success',
      data: student,
    };
  }
}

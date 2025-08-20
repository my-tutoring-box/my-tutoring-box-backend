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

  @Get(':userId/students')
  async getStudents(
    @Param('userId') userId: string,
  ): Promise<ApiSuccessResponse<Student[]>> {
    const students = await this.studentService.getStudents(userId);
    return {
      status: 'success',
      data: students,
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

  @Get('calendars')
  async getAllCalendars() {
    const calendars = await this.studentService.getMonthlyCalendars();
    return {
      status: 'success',
      data: calendars,
    };
  }

  @Get(':studentId/calendars')
  async getCalendars(@Param('studentId') studentId: string) {
    const calendars = await this.studentService.getStudentCalendars(studentId);
    return {
      status: 'success',
      data: calendars,
    };
  }

  @Patch(':studentId/count')
  async ManageSchedule(): Promise<void> {
    await this.studentService.ManageSchedule();
  }
}

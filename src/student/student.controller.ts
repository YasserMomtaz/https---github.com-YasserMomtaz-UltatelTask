import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { JwtAuthGuard } from 'src/auth/auth-jwt';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() student: Student): Promise<Student> {
    return this.studentService.create(student);
  }

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() student: Student): Promise<void> {
    return this.studentService.update(id, student);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.studentService.remove(id);
  }

  @Post('search')
  async search(
    @Body() query: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ data: Student[], total: number }> {
    return this.studentService.search(query, page, pageSize);
  }

  @Get('paginated')
  findAllPaginated(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<{ data: Student[], total: number }> {
    return this.studentService.findAllPaginated(page, pageSize);
  }
}

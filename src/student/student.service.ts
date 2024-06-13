import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(student: Student): Promise<Student> {
    try {
      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the student');
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving students');
    }
  }

  async findOne(id: number): Promise<Student> {
    try {
      const options: FindOneOptions<Student> = { where: { id } };
      const student = await this.studentRepository.findOne(options);
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while retrieving the student');
    }
  }

  async update(id: number, student: Student): Promise<void> {
    try {
      const result = await this.studentRepository.update(id, student);
      if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while updating the student');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.studentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while deleting the student');
    }
  }

  async search(query: any, page: number = 1, pageSize: number = 10): Promise<{ data: Student[], total: number }> {
    try {
      const qb = this.studentRepository.createQueryBuilder('student');
      
      if (query.name) {
        qb.andWhere('student.name LIKE :name', { name: `%${query.name}%` });
      }
      if (query.age) {
        const currentDate = new Date();
        const ageDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - query.age));
        qb.andWhere('student.dob <= :dob', { dob: ageDate });
      }
      if (query.ageto) {
        const currentDate2 = new Date();
        const ageDateTo = new Date(currentDate2.setFullYear(currentDate2.getFullYear() - query.ageto));
        qb.andWhere('student.dob >= :dobto', { dobto: ageDateTo });
      }
      if (query.country) {
        qb.andWhere('student.country LIKE :country', { country: `%${query.country}%` });
      }
      if (query.gender) {
        qb.andWhere('LOWER(student.gender) REGEXP  LOWER(:gender)', { gender: `\\b${query.gender}\\b` });
      }
    
      qb.skip((page - 1) * pageSize).take(pageSize);
    
      const [data, total] = await qb.getManyAndCount();
      
      return { data, total };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while searching for students');
    }
  }

  async findAllPaginated(page: number = 1, pageSize: number = 10): Promise<{ data: Student[], total: number }> {
    try {
      const [data, total] = await this.studentRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { data, total };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving paginated students');
    }
  }
}

import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string): Promise<any> {
    try {
      const userExists = await this.userRepository.findOne({ where: [{ username }, { email }] });
      if (userExists) {
        throw new ConflictException('Username or email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({ username, email, password: hashedPassword });
      await this.userRepository.save(newUser);
      return {msg:'User registered successfully'};
    } catch (error) {
        if (error instanceof ConflictException) {
            throw error;
          }
      throw new InternalServerErrorException('An error occurred during registration, Please try again');
    }
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: [{ username }] });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { username: user.username, email: user.email };
      const token = await this.jwtService.signAsync(payload);
      return {access_token:token};
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            throw error;
          }
        throw new InternalServerErrorException('An error occurred during login, Please try again');
    }
  }

  async validateUser(username: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
          }
      throw new InternalServerErrorException('An error occurred during user validation, Please try again');
    }
  }
}

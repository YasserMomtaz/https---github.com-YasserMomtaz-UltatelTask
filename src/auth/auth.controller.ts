// auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body('username') username: string, @Body('email') email: string, @Body('password') password: string): Promise<any> {
    return this.authService.register(username, email, password);
  }

  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string): Promise<string> {
    return this.authService.login(username, password);
  }
}

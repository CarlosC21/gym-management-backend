import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // src/auth/auth.controller.ts

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // Changed 'pass' to 'password'
    return this.authService.login(body.email, body.password);
  }
}

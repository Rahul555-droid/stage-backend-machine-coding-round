import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    return { token };
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    const newUser = await this.authService.register(
      body.username,
      body.email,
      body.password,
    );
    return { message: 'User registered successfully', userId: newUser._id };
  }
}

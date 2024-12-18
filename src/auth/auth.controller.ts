import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RegisterResponseDto,
} from './dto/auth.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth') // Swagger Tag
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    const token = await this.authService.login(body.email, body.password);
    return { token };
  }

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    const newUser = await this.authService.register(
      body.username,
      body.email,
      body.password,
    );
    return { message: 'User registered successfully', userId: newUser._id };
  }
}

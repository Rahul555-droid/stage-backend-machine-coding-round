import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(email: string, password: string): Promise<string> {
    // Fetch the user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password) || password === user.password ; //added the normal password matching Only for testing/development I am storing password as hashes in my implementation.
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.');
    }

    // Generate and return token
    return this.generateToken(user._id);
  }

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    return this.userService.createUser({
      username,
      email,
      password: hashedPassword,
    });
  }

  async generateToken(userId: string): Promise<string> {
    const secret = process.env.JWT_SECRET || 'defaultSecret'; // Replace with your env secret
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<{ userId: string }> {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}

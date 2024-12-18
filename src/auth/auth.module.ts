import { Module } from '@nestjs/common';
import { UserSchemaProvider } from 'src/models/user.schema';
import { UserModule } from '../user/user.module'; // Import UserModule for UserService access
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule, // Import UserModule to access UserService
    UserSchemaProvider,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

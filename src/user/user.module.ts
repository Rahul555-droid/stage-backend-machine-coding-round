import { Module } from '@nestjs/common';
import { UserSchemaProvider } from 'src/models/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [UserSchemaProvider],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

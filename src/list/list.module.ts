import { Module } from '@nestjs/common';
import { MovieSchemaProvider } from 'src/models/movie.schema';
import { TVShowSchemaProvider } from 'src/models/tvshow.schema';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { UserSchemaProvider } from 'src/models/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MovieSchemaProvider, TVShowSchemaProvider, UserSchemaProvider],
  controllers: [ListController],
  providers: [ListService, UserService, AuthService],
})
export class ListModule {}

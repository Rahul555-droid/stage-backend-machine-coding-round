import { Module } from '@nestjs/common';
import { MovieSchemaProvider } from 'src/models/movie.schema';
import { TVShowSchemaProvider } from 'src/models/tvshow.schema';
import { UserSchemaProvider } from 'src/models/user.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [MovieSchemaProvider, TVShowSchemaProvider, UserSchemaProvider],
  providers: [SeedService],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { ListSchemaProvider } from 'src/models/list.schema';
import { MovieSchemaProvider } from 'src/models/movie.schema';
import { TVShowSchemaProvider } from 'src/models/tvshow.schema';
import { SeedService } from './seed.service';
import { UserSchemaProvider } from 'src/models/user.schema';

@Module({
  imports: [
    MovieSchemaProvider,
    TVShowSchemaProvider,
    ListSchemaProvider,
    UserSchemaProvider,
  ],
  providers: [SeedService],
})
export class SeedModule {}

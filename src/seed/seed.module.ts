import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Movie } from 'src/models/movie.schema';
import { TVShowSchema } from 'src/models/tvshow.schema';
import { UserSchema } from 'src/models/user.schema';

@Module({
  imports: [Movie, TVShowSchema, UserSchema],
  providers: [SeedService],
})
export class SeedModule {}

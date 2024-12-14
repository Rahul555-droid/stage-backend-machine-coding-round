import { Module } from '@nestjs/common';
import { MovieSchemaProvider } from '../models/movie.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [MovieSchemaProvider],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

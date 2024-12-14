import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { List, ListSchema } from 'src/models/list.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: TVShow.name, schema: TVShowSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

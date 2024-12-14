import { Module } from '@nestjs/common';
import { ListSchemaProvider } from 'src/models/list.schema';
import { MovieSchemaProvider } from 'src/models/movie.schema';
import { TVShowSchemaProvider } from 'src/models/tvshow.schema';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [MovieSchemaProvider, TVShowSchemaProvider, ListSchemaProvider],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}

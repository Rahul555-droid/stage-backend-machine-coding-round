import { Module } from '@nestjs/common';
import { TVShowsController } from './tvshows.controller';
import { TVShowsService } from './tvshows.service';
import { TVShowSchemaProvider } from 'src/models/tvshow.schema';
@Module({
  imports: [TVShowSchemaProvider],
  controllers: [TVShowsController],
  providers: [TVShowsService],
})
export class TvshowsModule {}

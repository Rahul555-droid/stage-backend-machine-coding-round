import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ListModule } from './list/list.module';
import { MoviesModule } from './movies/movies.module';
import { SeedModule } from './seed/seed.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    ListModule,
    SeedModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose } from 'mongoose';
import { Episode, EpisodeSchema } from './episode.schema';
import { genre } from '../constants/constants';
import { MongooseModule } from '@nestjs/mongoose';

export type TVShowDocument = TVShow & Document;

@Schema()
export class TVShow {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  genres: string[];

  @Prop({ type: [EpisodeSchema], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);
export const TVShowSchemaProvider = MongooseModule.forFeature([
  { name: TVShow.name, schema: TVShowSchema },
]);

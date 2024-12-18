import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genre } from '../constants/constants';
export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string; // Add this field to include the MongoDB _id

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true }) // Email must be unique
  email: string;

  @Prop({ required: true }) // Password is required
  password: string;

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  favoriteGenres: string[];

  @Prop({
    type: [
      {
        type: String,
        enum: genre,
      },
    ],
  })
  dislikedGenres: string[];

  @Prop([
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @Prop([
    {
      contentId: { type: String, required: true },
      contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    },
  ])
  myList: {
    contentId: string;
    contentType: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaProvider = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

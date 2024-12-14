import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;  // Reference to the User who owns the list

  @Prop({ required: true, type: Types.ObjectId, refPath: 'type' })
  itemId: Types.ObjectId;  // Reference to either a movie or tv show

  @Prop({ required: true, enum: ['movie', 'tvshow'] })
  type: 'movie' | 'tvshow';  // Type to distinguish between movies and tv shows

  @Prop({ default: Date.now })
  dateAdded: Date;  // Date when the item was added to the list
}

export const ListSchema = SchemaFactory.createForClass(List);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop({ required: true, type: Types.ObjectId, refPath: 'type' })
  itemId: Types.ObjectId; // Reference to either a Movie or TVShow document

  @Prop({ required: true, enum: ['movie', 'tvshow'] })
  type: 'movie' | 'tvshow'; // Type to distinguish between Movie and TVShow

  @Prop({ default: Date.now })
  dateAdded: Date; // Date when the item was added to the list
}

export const ListSchema = SchemaFactory.createForClass(List);

export const ListSchemaProvider = MongooseModule.forFeature([
  { name: List.name, schema: ListSchema },
]);

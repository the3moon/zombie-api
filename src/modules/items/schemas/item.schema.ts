import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
import { Zombie } from '../../../modules/zombies/schemas/zombie.schema';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  externalId: number;

  @Prop({ type: Types.ObjectId, ref: Zombie.name })
  zombie: Zombie;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
export const itemModel = model<Item>(Item.name, ItemSchema);

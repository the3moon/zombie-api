import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

@Schema()
export class Zombie extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ZombieSchema = SchemaFactory.createForClass(Zombie);
export const zombieModel = model<Zombie>(Zombie.name, ZombieSchema);

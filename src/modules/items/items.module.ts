import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule } from '../currency/currency.module';
import { ZombiesModule } from '../zombies/zombies.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item, ItemSchema } from './schemas/item.schema';

@Module({
  exports: [ItemsService],
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    CurrencyModule,
    ZombiesModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}

import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { ZombiesModule } from '../zombies/zombies.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [CurrencyModule, ZombiesModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}

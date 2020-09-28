import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [CurrencyModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}

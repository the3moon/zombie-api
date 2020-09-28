import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Module({
  exports: [CurrencyService],
  providers: [CurrencyService],
})
export class CurrencyModule {}

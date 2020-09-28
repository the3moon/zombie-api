import { Test, TestingModule } from '@nestjs/testing';
import { CURRENCY, Exchange } from '../../interfaces/price.dto';

import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;
  beforeAll(async () => {
    const itemsModule: TestingModule = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();
    currencyService = itemsModule.get<CurrencyService>(CurrencyService);
  });

  describe('GET', () => {
    it('should make only one api call', async () => {
      const tables: Exchange[][] = await Promise.all([
        currencyService.getExchangeItems(),
        currencyService.getExchangeItems(),
      ]);
      expect(tables[0] === tables[1]).toBeTruthy();
    });

    it('should return currency exchange table', async () => {
      const table = await currencyService.getExchangeItems();

      const availableCurrencies = Object.values(CURRENCY);
      table.forEach(rate => {
        expect(availableCurrencies).toEqual(
          expect.arrayContaining([rate.currency]),
        );
      });
    });
  });
});

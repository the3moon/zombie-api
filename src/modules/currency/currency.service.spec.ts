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

  describe('Get curriencies rates', () => {
    it('should make only one api call', async () => {
      const tables: Exchange[][] = await Promise.all([
        currencyService.getExchangeRates(),
        currencyService.getExchangeRates(),
      ]);
      const table3 = await currencyService.getExchangeRates();
      expect(tables[0] === tables[1]).toBeTruthy();
      expect(tables[0] === table3).toBeTruthy();
    });

    it('should return currency exchange table', async () => {
      const table = await currencyService.getExchangeRates();

      const availableCurrencies = Object.values(CURRENCY);
      table.forEach(rate => {
        expect(rate).toHaveProperty('aprox');
        expect(rate).toHaveProperty('bid');
        expect(rate).toHaveProperty('ask');
        expect(rate).toHaveProperty('currency');

        expect(availableCurrencies).toEqual(
          expect.arrayContaining([rate.currency]),
        );
      });
    });
  });
});

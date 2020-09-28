import { Test, TestingModule } from '@nestjs/testing';
import { CURRENCY, Exchange, PriceDto } from '../../interfaces/price.dto';

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

  describe('Price DTO creation', () => {
    it('should return valid PriceDto', () => {
      const euroEchange = { currency: CURRENCY.EUR, aprox: 3, bid: 3, ask: 3 };
      const plnEchange = { currency: CURRENCY.PLN, aprox: 1, bid: 1, ask: 1 };
      const usdEchange = { currency: CURRENCY.USD, aprox: 2, bid: 2, ask: 2 };

      const priceDto = new PriceDto(1, [euroEchange, plnEchange, usdEchange]);
      expect(priceDto).toHaveProperty(CURRENCY.EUR, 0.33);
      expect(priceDto).toHaveProperty(CURRENCY.USD, 0.5);
      expect(priceDto).toHaveProperty(CURRENCY.PLN, 1);
    });
  });
});

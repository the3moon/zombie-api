export enum CURRENCY {
  USD = 'usd',
  EUR = 'eur',
  PLN = 'pln',
}

export class PriceDto {
  constructor(price: number, exchangeRates: Exchange[]) {
    exchangeRates.forEach(rate => {
      this[rate.currency] = Math.round((price * 100) / rate.aprox) / 100;
    });
  }
}

export interface Exchange {
  bid: number;
  ask: number;
  aprox: number;
  currency: CURRENCY;
}

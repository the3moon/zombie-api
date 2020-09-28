export enum CURRENCY {
  USD = 'usd',
  EUR = 'eur',
  PLN = 'pln',
}

export class PriceDto {
  [CURRENCY.PLN]: number;
  [CURRENCY.EUR]: number;
  [CURRENCY.USD]: number;
}

export interface Exchange {
  bid: number;
  ask: number;
  aprox: number;
  currency: CURRENCY;
}

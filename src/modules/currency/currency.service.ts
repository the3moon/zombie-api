import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';
import { CURRENCY, Exchange } from '../../interfaces/price.dto';

export interface Rate {
    bid:number,
    ask:number,
    currency: string,
    code: string
}

export interface NPBresponse {
    table: string,
        no: string,
        tradingDate: string,
        effectiveDate: string,
        rates: Rate[]
}

@Injectable()
export class CurrencyService {

    #exchangeCurrencies: Exchange[];
    #lastUpdate = 0;
    #isFetching = false;
    #fetchPromise: Promise<AxiosResponse<NPBresponse[]>>;

    async getExchangeRates(){
        const milisendsInDay = 1000 * 60 * 60 * 24;
        const now = Date.now();
        if(!this.#exchangeCurrencies || !this.#lastUpdate || now - this.#lastUpdate > milisendsInDay){
           
            try {
                if(this.#isFetching){
                    await this.#fetchPromise;
                    return this.#exchangeCurrencies;
                }
                this.#isFetching = true;
                this.#fetchPromise = Axios.get<NPBresponse[]>('http://api.nbp.pl/api/exchangerates/tables/C/today');  
                const resp = await this.#fetchPromise;          ;
                const availableRates = resp.data[0].rates.filter((rate)=> Object.keys(CURRENCY).includes(rate.code));
                const formatedRates: Exchange[] = availableRates.map(rate=>{
                    return {
                        bid: rate.bid,
                        ask: rate.ask,
                        aprox: (rate.ask + rate.bid) / 2,
                        currency: CURRENCY[rate.code]
                    }
                })

                formatedRates.push({
                    bid:1,
                    ask:1,
                    aprox:1,
                    currency:CURRENCY.PLN
                })

                this.#exchangeCurrencies = formatedRates;
                this.#lastUpdate = new Date(resp.data[0].effectiveDate).getTime();
            } catch (error) {
                console.error(error);
                throw new HttpException('Can not get currency exchange list', HttpStatus.INTERNAL_SERVER_ERROR);
            }finally{
                this.#isFetching = false;
            }

        }

        return this.#exchangeCurrencies;
    }
}

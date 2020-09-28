import {HttpException, HttpStatus,  Injectable } from "@nestjs/common";
import Axios from "axios";
import { ExchangeItem } from "./dto/exchange.item.dto";


@Injectable()
export class ItemsService{
    #exchangeItems: ExchangeItem[];
    #lastUpdate: number;
    #isFetching= false;
    #fetchPromise: Promise<any>;

    async getExchangeItems(){
        const milisendsInDay = 1000 * 60 * 60 * 24;
        const now = Date.now();
        if(!this.#exchangeItems || !this.#lastUpdate || now - this.#lastUpdate > milisendsInDay){
            try {
                if(this.#isFetching){
                    await this.#fetchPromise;
                    return this.#exchangeItems;
                }

                this.#isFetching = true;
                this.#fetchPromise = Axios.get('https://zombie-items-api.herokuapp.com/api/items');                            
                const resp = await this.#fetchPromise;

                this.#exchangeItems = resp.data.items;
                this.#lastUpdate = resp.data.timestamp;
            } catch (error) {
                console.error(error);
                throw new HttpException('Can not get items list', HttpStatus.INTERNAL_SERVER_ERROR);
            }finally{
                this.#isFetching = false;

            }

        }

        return this.#exchangeItems;
    }
}
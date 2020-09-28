import {HttpException, HttpStatus,  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import Axios from "axios";
import { Model, Types } from "mongoose";
import { ZombiesService } from "../zombies/zombies.service";
import { CreateItemDto } from "./dto/create.item.dto";
import { ExchangeItem } from "./dto/exchange.item.dto";
import { UpdateItemDto } from "./dto/update.item.dto";
import { Item } from "./schemas/item.schema";


@Injectable()
export class ItemsService{
    #exchangeItems: ExchangeItem[];
    #lastUpdate: number;
    #isFetching= false;
    #fetchPromise: Promise<any>;

    constructor(@InjectModel(Item.name) private itemModel: Model<Item>, private zombiesSerivce : ZombiesService){}

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

    async getExchangeItem(externalId: number){
        const items = await this.getExchangeItems();
        const found =  items.find(item=>item.id===externalId);
        if(!found){
            throw new HttpException('Item not found',HttpStatus.NOT_FOUND);
        }
        return found;
    }

    async storeItem(createItemDto: CreateItemDto): Promise<Item> {        
        const zombie = await this.zombiesSerivce.getZombie(createItemDto.zombie);        
        
        const externalItem = await this.getExchangeItem(createItemDto.externalId);

        const newItem = new this.itemModel({
          name: externalItem.name,
          externalId: externalItem.id,
          zombie,          
          createdAt: new Date(),
        });

        const itemsCount = await this.itemModel.countDocuments({zombie});

        if(itemsCount >= 5){
            throw new HttpException('Zombie can not have more than 5 items',HttpStatus.BAD_REQUEST);
        }

        await newItem.save();
    
        return newItem;
      }
    
      async getItem(itemId: string): Promise<Item> {
        if (!itemId || !Types.ObjectId.isValid(itemId)) {
          throw new HttpException('Invalid item ID', HttpStatus.BAD_REQUEST);
        }
        const item = await this.itemModel.findById(itemId);
        if (!item) {
          throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        return item;
      }
    
      async getItems(): Promise<Item[]> {
        return await this.itemModel.find();
      }
    
      async updateItem(
        itemId: string,
        updateItemDto: UpdateItemDto,
      ): Promise<Item> {
        const item = await this.getItem(itemId);
        const zombie = await this.zombiesSerivce.getZombie(updateItemDto.zombie);     

        if(zombie._id.equals(item.zombie._id)){
            return item;
        }
        const itemsCount = await this.itemModel.countDocuments({zombie});

        if(itemsCount>=5){
            throw new HttpException('Zombie can not have more than 5 items',HttpStatus.BAD_REQUEST);
        } 

        item.zombie = zombie;
    
        await item.save();
    
        return item;
      }
    
      async removeItem(itemId: string): Promise<Item> {
        const item = await this.getItem(itemId);
        await item.remove();
        return item;
      }
      
}
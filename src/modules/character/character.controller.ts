import { Controller, Get, Param } from '@nestjs/common';
import { CURRENCY, PriceDto } from '../../interfaces/price.dto';
import { CurrencyService } from '../currency/currency.service';
import { GetItemDto } from '../items/dto/get.item.dto';
import { ItemsService } from '../items/items.service';
import { ZombiesService } from '../zombies/zombies.service';
import { GetCharacterDto } from './dto/get.character.dto';

@Controller('api/character')
export class CharacterController {
  constructor(
    private zombiesService: ZombiesService,
    private itemsService: ItemsService,
    private currencyService: CurrencyService,
  ) {}

  @Get(':id')
  async getCharacter(@Param('id') id: string): Promise<GetCharacterDto> {
    const zombie = await this.zombiesService.getZombie(id);
    const items = await this.itemsService.getZombieItems(zombie);
    const exchangeRates = await this.currencyService.getExchangeRates();
    const externalItems = await this.itemsService.getExchangeItems();

    const itemsPrices = items.map(item => {
      const exchangeItem = externalItems.find(i => i.id === item.externalId);
      return exchangeItem.price;
    });
    const pricesInAllCurrencies: PriceDto[] = itemsPrices.map(
      price => new PriceDto(price, exchangeRates),
    );

    const summedPrices = pricesInAllCurrencies.reduce((agr, current) => {
      Object.values(CURRENCY).forEach(key => {
        agr[key] += current[key];
      });
      return agr;
    }, new PriceDto(0, exchangeRates));

    return {
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt,
      items: items.map(i => new GetItemDto(i)),
      value: summedPrices,
    };
  }
}

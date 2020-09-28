import { Controller } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { ItemsService } from '../items/items.service';
import { ZombiesService } from '../zombies/zombies.service';

@Controller('api/character')
export class CharacterController {
  constructor(
    private zombiesService: ZombiesService,
    private itemsController: ItemsService,
    private currencyService: CurrencyService,
  ) {}
}

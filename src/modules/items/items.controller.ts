import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('api/items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  async getExchangeItems() {
    return await this.itemsService.getExchangeItems();
  }
}

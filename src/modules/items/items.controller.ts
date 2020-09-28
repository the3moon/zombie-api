import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateItemDto } from '../items/dto/create.item.dto';
import { GetItemDto } from '../items/dto/get.item.dto';
import { UpdateItemDto } from '../items/dto/update.item.dto';
import { ItemsService } from './items.service';

@Controller('api/items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get('/exchange')
  async getExchangeItems() {
    return await this.itemsService.getExchangeItems();
  }

  @Get('/exchange/:id')
  async getExchangeItem(@Param('id', ParseIntPipe) externalId: number) {
    return await this.itemsService.getExchangeItem(externalId);
  }

  @Post()
  async storeItem(@Body() itemDto: CreateItemDto): Promise<GetItemDto> {
    const newItem = await this.itemsService.storeItem(itemDto);
    return new GetItemDto(newItem);
  }

  @Get(':id')
  async getItem(@Param('id') itemId: string): Promise<GetItemDto> {
    const item = await this.itemsService.getItem(itemId);
    return new GetItemDto(item);
  }

  @Get('')
  async getItems(): Promise<GetItemDto[]> {
    const items = await this.itemsService.getItems();
    return items.map(item => new GetItemDto(item));
  }

  @Patch(':id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<GetItemDto> {
    const item = await this.itemsService.updateItem(itemId, updateItemDto);
    return new GetItemDto(item);
  }

  @Delete(':id')
  async removeItem(@Param('id') itemId: string): Promise<GetItemDto> {
    const item = await this.itemsService.removeItem(itemId);
    return new GetItemDto(item);
  }
}

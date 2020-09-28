import { PriceDto } from 'src/interfaces/price.dto';
import { GetItemDto } from 'src/modules/items/dto/get.item.dto';

export class GetCharacterDto {
  name: string;
  id: string;
  items: GetItemDto[];
  value: PriceDto;
  createdAt;
}

import { Item } from '../schemas/item.schema';

export class GetItemDto {
  constructor(item: Item) {
    this.id = item.id;
    this.name = item.name;
    this.createdAt = item.createdAt.toISOString();
    this.externalId = item.externalId;
    this.zombie = item.zombie._id.toString();
  }
  name: string;
  id: string;
  zombie: string;
  externalId: number;
  createdAt: string;
}

import { Zombie } from '../schemas/zombie.schema';

export class GetZombieDto {
  constructor(zombie: Zombie) {
    this.id = zombie.id;
    this.name = zombie.name;
    this.createdAt = zombie.createdAt.toISOString();
  }
  name: string;
  id: string;
  createdAt: string;
}

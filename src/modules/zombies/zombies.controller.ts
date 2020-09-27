import { Body, Controller, Post } from '@nestjs/common';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { GetZombieDto } from './dto/get.zombie.dto';
import { ZombiesService } from './zombies.service';

@Controller('api/zombies')
export class ZombiesController {
  constructor(private zombiesService: ZombiesService) {}

  @Post()
  async storeZombie(@Body() zombieDto: CreateZombieDto): Promise<GetZombieDto> {
    const newZombie = await this.zombiesService.storeZombie(zombieDto);
    return {
      id: newZombie.id,
      name: newZombie.name,
      createdAt: newZombie.createdAt.toISOString(),
    };
  }
}

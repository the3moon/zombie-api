import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { GetZombieDto } from './dto/get.zombie.dto';
import { UpdateZombieDto } from './dto/update.zombie.dto';
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

  @Get(':id')
  async getZombie(@Param('id') zombieId: string): Promise<GetZombieDto> {
    const zombie = await this.zombiesService.getZombie(zombieId);
    return {
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt.toISOString(),
    };
  }

  @Get('')
  async getZombies(): Promise<GetZombieDto[]> {
    const zombies = await this.zombiesService.getZombies();
    return zombies.map(zombie => ({
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt.toISOString(),
    }));
  }

  @Patch(':id')
  async updateZombie(
    @Param('id') zombieId: string,
    @Body() updateZombieDto: UpdateZombieDto,
  ): Promise<GetZombieDto> {
    const zombie = await this.zombiesService.updateZombie(
      zombieId,
      updateZombieDto,
    );
    return {
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt.toISOString(),
    };
  }

  @Delete(':id')
  async removeZombie(@Param('id') zombieId: string): Promise<GetZombieDto> {
    const zombie = await this.zombiesService.removeZombie(zombieId);
    return {
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt.toISOString(),
    };
  }
}

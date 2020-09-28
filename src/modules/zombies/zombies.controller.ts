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
    return new GetZombieDto(newZombie);
  }

  @Get(':id')
  async getZombie(@Param('id') zombieId: string): Promise<GetZombieDto> {
    const zombie = await this.zombiesService.getZombie(zombieId);
    return new GetZombieDto(zombie);
  }

  @Get('')
  async getZombies(): Promise<GetZombieDto[]> {
    const zombies = await this.zombiesService.getZombies();
    return zombies.map(zombie => new GetZombieDto(zombie));
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
    return new GetZombieDto(zombie);
  }

  @Delete(':id')
  async removeZombie(@Param('id') zombieId: string): Promise<GetZombieDto> {
    const zombie = await this.zombiesService.removeZombie(zombieId);
    return new GetZombieDto(zombie);
  }
}

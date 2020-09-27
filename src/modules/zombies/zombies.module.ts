import { Module } from '@nestjs/common';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';

@Module({
  providers: [ZombiesService],
  controllers: [ZombiesController],
})
export class ZombiesModule {}

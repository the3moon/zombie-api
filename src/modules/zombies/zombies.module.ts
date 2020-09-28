import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Zombie, ZombieSchema } from './schemas/zombie.schema';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';

@Module({
  exports: [ZombiesService],
  imports: [
    MongooseModule.forFeature([{ name: Zombie.name, schema: ZombieSchema }]),
  ],
  providers: [ZombiesService],
  controllers: [ZombiesController],
})
export class ZombiesModule {}

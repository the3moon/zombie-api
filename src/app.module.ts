import { Module } from '@nestjs/common';
import { ZombiesModule } from './modules/zombies/zombies.module';

@Module({
  imports: [ZombiesModule],
})
export class AppModule {}

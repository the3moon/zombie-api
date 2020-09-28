import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { ItemsModule } from '../items/items.module';
import { ZombiesModule } from '../zombies/zombies.module';
import { CharacterController } from './character.controller';

@Module({
  imports: [ZombiesModule, ItemsModule, CurrencyModule],
  controllers: [CharacterController],
})
export class CharacterModule {}

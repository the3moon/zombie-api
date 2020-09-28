import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './modules/character/character.module';
import { ItemsModule } from './modules/items/items.module';
import { ZombiesModule } from './modules/zombies/zombies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ZombiesModule,
    ItemsModule,
    CharacterModule,
  ],
})
export class AppModule {}

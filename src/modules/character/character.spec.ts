import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DB_URI } from '../../../test/db';
import { CurrencyModule } from '../currency/currency.module';
import { ItemsModule } from '../items/items.module';
import { Item, itemModel } from '../items/schemas/item.schema';
import { Zombie, zombieModel } from '../zombies/schemas/zombie.schema';
import { ZombiesModule } from '../zombies/zombies.module';
import { CharacterController } from './character.controller';

describe('CharacterController', () => {
  let characterController: CharacterController;
  let characterModule: TestingModule;
  let zombie: Zombie;
  beforeAll(async () => {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase();

    zombie = await zombieModel.create<Zombie>({
      name: 'Andrzej',
      createdAt: new Date(),
    });
    await zombie.save();

    characterModule = await Test.createTestingModule({
      imports: [
        ZombiesModule,
        ItemsModule,
        CurrencyModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(DB_URI),
      ],
      controllers: [CharacterController],
    }).compile();

    characterController = characterModule.get<CharacterController>(
      CharacterController,
    );
  });

  afterAll(async () => {
    await characterModule.close();
    await mongoose.connection.close();
  });

  describe('GET', () => {
    it('Should get character without items ', async () => {
      const character = await characterController.getCharacter(zombie.id);
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('createdAt');
      expect(character).toHaveProperty('items');
      expect(character.items).toEqual([]);
      expect(character).toHaveProperty('value');
    });

    it('Should get character with 2 items ', async () => {
      await itemModel.create<Item>({
        zombie,
        createdAt: new Date(),
        externalId: 1,
        name: 'Does not matter',
      });

      await itemModel.create<Item>({
        zombie,
        createdAt: new Date(),
        externalId: 2,
        name: 'Or does ?',
      });

      const character = await characterController.getCharacter(zombie.id);
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('createdAt');
      expect(character).toHaveProperty('items');
      expect(character.items.length).toEqual(2);
      expect(character).toHaveProperty('value');
    });

    it('Should not get invalid id character', async () => {
      try {
        await characterController.getCharacter('123456789012345678901234');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Zombie not found');
      }

      try {
        await characterController.getCharacter('DefinetlyInvalidId');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Invalid zombie ID');
      }
    });
  });
});

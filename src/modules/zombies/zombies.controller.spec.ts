import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DB_URI } from '../../../test/db';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { Zombie, ZombieSchema } from './schemas/zombie.schema';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';
describe('ZombiesController', () => {
  let zombiesController: ZombiesController;
  let zombiesModule: TestingModule;

  beforeAll(async () => {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase();

    zombiesModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(DB_URI),
        MongooseModule.forFeature([
          { name: Zombie.name, schema: ZombieSchema },
        ]),
      ],
      controllers: [ZombiesController],
      providers: [ZombiesService],
    }).compile();

    zombiesController = zombiesModule.get<ZombiesController>(ZombiesController);
  });

  afterAll(async () => {
    await zombiesModule.close();
    await mongoose.connection.close();
  });

  describe('CREATE', () => {
    const zombieToStore: CreateZombieDto = { name: 'Janek' };
    it('should create valid zombie', async () => {
      const zombie = await zombiesController.storeZombie(zombieToStore);
      expect(zombie).toHaveProperty('name', zombieToStore.name);
      expect(zombie).toHaveProperty('createdAt');
      expect(zombie).toHaveProperty('id');
    });

    it('should not create duplicate zombie', async () => {
      try {
        await zombiesController.storeZombie(zombieToStore);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie name is taken');
      }
    });

    it('should not create invalid zombie', async () => {
      try {
        await zombiesController.storeZombie({} as any);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie name is required');
      }
      try {
        await zombiesController.storeZombie({ name: true } as any);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie name has to be a string');
      }
      try {
        await zombiesController.storeZombie({ name: 'g' });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          'Zombie name has to have at leat 2 chars',
        );
      }
    });
  });

  describe('READ', () => {
    it('should return one zombie', () => {
      //
    });

    it('should not return not existing zombie', () => {
      //
    });

    it('should return zombie list', () => {
      //
    });
  });

  describe('UPDATE', () => {
    it('should update zombie"', () => {
      //
    });

    it('should not update not existing zombie', () => {
      //
    });

    it('should not update zombie with invalid data"', () => {
      //
    });
  });

  describe('DELETE', () => {
    it('should delete zombie', () => {
      //
    });

    it('should not delete not existing zombie', () => {
      //
    });
  });
});

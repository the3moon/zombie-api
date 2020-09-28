import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DB_URI } from '../../../test/db';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { GetZombieDto } from './dto/get.zombie.dto';
import { UpdateZombieDto } from './dto/update.zombie.dto';
import { Zombie, zombieModel, ZombieSchema } from './schemas/zombie.schema';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';
describe('ZombiesController', () => {
  let zombiesController: ZombiesController;
  let zombiesModule: TestingModule;
  const zombiesCollection = zombieModel.collection;

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

  let zombiesBefore: number;

  beforeEach(async () => {
    zombiesBefore = await zombiesCollection.estimatedDocumentCount();
  });

  let createdZombie: GetZombieDto;
  describe('CREATE', () => {
    const zombieToStore: CreateZombieDto = { name: 'Janek' };
    it('should create valid zombie', async () => {
      const zombie = await zombiesController.storeZombie(zombieToStore);

      const zombiesAfter = await zombiesCollection.estimatedDocumentCount();
      expect(zombiesAfter - zombiesBefore).toEqual(1);

      expect(zombie).toHaveProperty('name', zombieToStore.name);
      expect(zombie).toHaveProperty('createdAt');
      expect(zombie).toHaveProperty('id');

      createdZombie = zombie;
    });

    it('should not create duplicate zombie', async () => {
      try {
        await zombiesController.storeZombie(zombieToStore);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie name is taken');
      }
      const zombiesAfter = await zombiesCollection.estimatedDocumentCount();
      expect(zombiesAfter - zombiesBefore).toEqual(0);
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

      const zombiesAfter = await zombiesCollection.estimatedDocumentCount();
      expect(zombiesAfter - zombiesBefore).toEqual(0);
    });
  });

  describe('READ', () => {
    it('should return one zombie', async () => {
      expect(await zombiesController.getZombie(createdZombie.id)).toEqual(
        createdZombie,
      );
    });

    it('should not return not existing zombie', async () => {
      try {
        await zombiesController.getZombie('NotValidId');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Invalid zombie ID');
      }
      try {
        await zombiesController.getZombie('000000000000000000000000');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie not found');
      }
    });

    it('should return zombie list', async () => {
      const zombies = await zombiesController.getZombies();
      expect(zombies).toEqual(expect.arrayContaining([createdZombie]));
    });
  });

  describe('UPDATE', () => {
    it('should update only zombie name"', async () => {
      const zombie = await zombiesController.updateZombie(createdZombie.id, {
        name: 'Jan',
        id: 'Something disgusting',
        createdAt: new Date(),
      } as any);
      expect(zombie).toHaveProperty('name', 'Jan');
      expect(zombie).toHaveProperty('id', createdZombie.id);
      expect(zombie).toHaveProperty('createdAt', createdZombie.createdAt);
      createdZombie = zombie;
    });

    it('update zombie with the same name should be allowed"', async () => {
      const zombie = await zombiesController.updateZombie(createdZombie.id, {
        name: createdZombie.name,
      });
      expect(zombie).toHaveProperty('name', createdZombie.name);
      expect(zombie).toHaveProperty('id', createdZombie.id);
      expect(zombie).toHaveProperty('createdAt', createdZombie.createdAt);
    });

    it('should not update not existing zombie', async () => {
      try {
        await zombiesController.updateZombie('000000000000000000000000', {
          name: 'Whatever',
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual('Zombie not found');
      }
    });

    it('should not update zombie with invalid data"', async () => {
      try {
        const updateZombieDto: UpdateZombieDto = { name: 'f' };
        await zombiesController.updateZombie(createdZombie.id, updateZombieDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toEqual(
          'Zombie name has to have at leat 2 chars',
        );
      }
    });
  });

  describe('DELETE', () => {
    it('should delete zombie', async () => {
      const zombie = await zombiesController.removeZombie(createdZombie.id);
      expect(zombie).toEqual(createdZombie);
      const zombiesAfter = await zombiesCollection.estimatedDocumentCount();

      expect(zombiesAfter - zombiesBefore).toEqual(-1);
    });

    it('should not delete not existing zombie', async () => {
      try {
        await zombiesController.removeZombie(createdZombie.id);
      } catch (error) {
        expect(error.message).toEqual('Zombie not found');
      }
      const zombiesAfter = await zombiesCollection.estimatedDocumentCount();

      expect(zombiesAfter - zombiesBefore).toEqual(0);
    });
  });
});

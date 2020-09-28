import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DB_URI } from '../../../test/db';
import { Item, itemModel, ItemSchema } from './schemas/item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ExchangeItem } from './dto/exchange.item.dto';
import { ZombiesModule } from '../zombies/zombies.module';
import { Zombie, zombieModel } from '../zombies/schemas/zombie.schema';
import { GetItemDto } from './dto/get.item.dto';

const MAX_ZOMBIE_ITEMS = 5;

describe('ItemsController', () => {
  let itemsController: ItemsController;
  let itemsModule: TestingModule;
  let zombie: Zombie;
  let zombie2: Zombie;
  let externalItems: ExchangeItem[];
  const itemsCollection = itemModel.collection;

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
    zombie2 = await zombieModel.create<Zombie>({
      name: 'Mariusz',
      createdAt: new Date(),
    });
    await zombie2.save();

    itemsModule = await Test.createTestingModule({
      imports: [
        ZombiesModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(DB_URI),
        MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
      ],
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    itemsController = itemsModule.get<ItemsController>(ItemsController);
  });

  afterAll(async () => {
    await itemsModule.close();
    await mongoose.connection.close();
  });

  let itemsBefore: number;

  beforeEach(async () => {
    itemsBefore = await itemsCollection.estimatedDocumentCount();
  });

  describe('Get external items exchange', () => {
    it('should make only one api call', async () => {
      const tables: ExchangeItem[][] = await Promise.all([
        itemsController.getExchangeItems(),
        itemsController.getExchangeItems(),
      ]);
      const table3 = await itemsController.getExchangeItems();
      expect(tables[0] === tables[1]).toBeTruthy();
      expect(tables[0] === table3).toBeTruthy();
    });

    it('should return items exchange table', async () => {
      externalItems = await itemsController.getExchangeItems();

      externalItems.forEach(item => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('price');
      });
    });

    it('should return one item from exchange table', async () => {
      const item = await itemsController.getExchangeItem(externalItems[0].id);

      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('price');
    });
  });
  let createdItem: GetItemDto;
  describe('CREATE', () => {
    it('should create valid item', async () => {
      const firstItem = externalItems[0];
      createdItem = await itemsController.storeItem({
        zombie: zombie.id,
        externalId: firstItem.id,
      });
      expect(createdItem).toHaveProperty('name');
      expect(createdItem).toHaveProperty('id');
      expect(createdItem).toHaveProperty('createdAt');
      expect(createdItem).toHaveProperty('zombie', zombie.id);
      expect(createdItem).toHaveProperty('externalId', firstItem.id);
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(1);
    });

    it(`should create ${MAX_ZOMBIE_ITEMS} valid items for zombie`, async () => {
      const promises = [];
      for (let i = 0; i < MAX_ZOMBIE_ITEMS - 1; i++) {
        promises.push(
          itemsController.storeItem({
            zombie: zombie.id,
            externalId: externalItems[i].id,
          }),
        );
      }
      await Promise.all(promises);
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(MAX_ZOMBIE_ITEMS - 1);
    });

    it(`should not create more than ${MAX_ZOMBIE_ITEMS} items for zombie`, async () => {
      try {
        await itemsController.storeItem({
          zombie: zombie.id,
          externalId: externalItems[0].id,
        }),
          expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe(
          `Zombie can not have more than ${MAX_ZOMBIE_ITEMS} items`,
        );
      }
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(0);
    });

    it('should not create invalid item', async () => {
      try {
        await itemsController.storeItem({
          zombie: 'InvalidId',
          externalId: 1,
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Invalid zombie ID');
      }
      try {
        await itemsController.storeItem({
          zombie: zombie.id,
          externalId: 'invalid id too' as any,
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(0);
    });
  });

  describe('READ', () => {
    it('should return one item', async () => {
      const item = await itemsController.getItem(createdItem.id);
      expect(item).toBe(item);
    });

    it('should not return with invalid ID', async () => {
      try {
        await itemsController.getItem('InvalidId');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Invalid item ID');
      }
    });

    it('should not return not existing item', async () => {
      try {
        await itemsController.getItem('000000000000000000000000');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
    });

    it('should return item list', async () => {
      const items = await itemsController.getItems();
      expect(items).toEqual(expect.arrayContaining([createdItem]));
    });
  });

  describe('UPDATE', () => {
    it(`should not update when target zombie has ${MAX_ZOMBIE_ITEMS} items`, async () => {
      try {
        const item = await itemsController.storeItem({
          zombie: zombie2.id,
          externalId: externalItems[0].id,
        });
        await itemsController.updateItem(item.id, {
          zombie: zombie.id,
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe(
          `Zombie can not have more than ${MAX_ZOMBIE_ITEMS} items`,
        );
      }
    });

    it("should update only item's zombie", async () => {
      const item = await itemsController.updateItem(createdItem.id, {
        zombie: zombie2.id,
      });
      expect(item).toHaveProperty('zombie', zombie2.id);
      expect(item).toHaveProperty('name', createdItem.name);
      expect(item).toHaveProperty('createdAt', createdItem.createdAt);
      expect(item).toHaveProperty('id', createdItem.id);
      expect(item).toHaveProperty('externalId', createdItem.externalId);
      createdItem = item;
    });

    it('update item with the same zombie should be allowed - no-op', async () => {
      const item = await itemsController.updateItem(createdItem.id, {
        zombie: createdItem.zombie,
      });
      expect(item).toHaveProperty('zombie', createdItem.zombie);
      expect(item).toHaveProperty('name', createdItem.name);
      expect(item).toHaveProperty('createdAt', createdItem.createdAt);
      expect(item).toHaveProperty('id', createdItem.id);
      expect(item).toHaveProperty('externalId', createdItem.externalId);
    });

    it('should not update not existing item', async () => {
      try {
        await itemsController.updateItem('123456789012345678901234', {
          zombie: createdItem.zombie,
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
    });

    it('should not update item with invalid data"', async () => {
      try {
        await itemsController.updateItem(createdItem.id, {
          zombie: '123456789012345678901234',
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Zombie not found');
      }
    });
  });

  describe('DELETE', () => {
    it('should delete item', async () => {
      await itemsController.removeItem(createdItem.id);
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(-1);
    });

    it('should not delete not existing item', async () => {
      try {
        await itemsController.removeItem(createdItem.id);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
      const itemsAfter = await itemsCollection.estimatedDocumentCount();
      expect(itemsAfter - itemsBefore).toEqual(0);
    });
  });
});

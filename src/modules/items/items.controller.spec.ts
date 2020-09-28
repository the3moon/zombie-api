import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { DB_URI } from '../../../test/db';
import { Item, ItemModel, ItemSchema } from './schemas/item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ExchangeItem } from './dto/exchange.item.dto';

describe('ItemsController', () => {
  let itemsController: ItemsController;
  let itemsModule: TestingModule;
  const itemsCollection = ItemModel.collection;

  beforeAll(async () => {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.connection.db.dropDatabase();

    itemsModule = await Test.createTestingModule({
      imports: [
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
    itemsBefore = await itemsCollection.countDocuments();
  });

  describe('Get items exchange table', () => {
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
      const table = await itemsController.getExchangeItems();

      table.forEach(item => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('price');
      });
    });
  });

  describe('CREATE', () => {
    it('should create valid item', async () => {
      const itemsAfter = await itemsCollection.countDocuments();
      expect(itemsAfter - itemsBefore).toEqual(1);
    });

    it('should not create invalid item', async () => {
      const itemsAfter = await itemsCollection.countDocuments();
      expect(itemsAfter - itemsBefore).toEqual(0);
    });
  });

  describe('READ', () => {
    it('should return one item', async () => {
      //
    });

    it('should not return not existing item', async () => {
      //
    });

    it('should return item list', async () => {
      //
    });
  });

  describe('UPDATE', () => {
    it('should update only item name"', async () => {
      //
    });

    it('update item with the same name should be allowed"', async () => {
      //
    });

    it('should not update not existing item', async () => {
      //
    });

    it('should not update item with invalid data"', async () => {
      //
    });
  });

  describe('DELETE', () => {
    it('should delete item', async () => {
      const itemsAfter = await itemsCollection.countDocuments();
      expect(itemsAfter - itemsBefore).toEqual(-1);
    });

    it('should not delete not existing item', async () => {
      const itemsAfter = await itemsCollection.countDocuments();
      expect(itemsAfter - itemsBefore).toEqual(0);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ZombiesController } from './zombies.controller';
import { ZombiesService } from './zombies.service';
describe('ZombiesController', () => {
  let zombiesController: ZombiesController;

  beforeEach(async () => {
    const zombies: TestingModule = await Test.createTestingModule({
      controllers: [ZombiesController],
      providers: [ZombiesService],
    }).compile();

    zombiesController = zombies.get<ZombiesController>(ZombiesController);
  });

  describe('CREATE', () => {
    it('should create valid zombie', () => {
      //
    });

    it('should not create invalid zombie', () => {
      //
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

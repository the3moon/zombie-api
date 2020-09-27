import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { Model, Types } from 'mongoose';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { UpdateZombieDto } from './dto/update.zombie.dto';
import { Zombie } from './schemas/zombie.schema';

@Injectable()
export class ZombiesService {
  constructor(@InjectModel(Zombie.name) private zombieModel: Model<Zombie>) {}

  async storeZombie(createZombieDto: CreateZombieDto): Promise<Zombie> {
    await this.validateNewZombieName(createZombieDto.name);

    const newZombie = new this.zombieModel({
      name: createZombieDto.name,
      createdAt: new Date(),
    });

    await newZombie.save();

    return newZombie;
  }

  async getZombie(zombieId: string): Promise<Zombie> {
    if (!zombieId || !Types.ObjectId.isValid(zombieId)) {
      throw new HttpException('Invalid zombie ID', HttpStatus.BAD_REQUEST);
    }
    const zombie = await this.zombieModel.findById(zombieId);
    if (!zombie) {
      throw new HttpException('Zombie not found', HttpStatus.NOT_FOUND);
    }
    return zombie;
  }

  async getZombies(): Promise<Zombie[]> {
    return await this.zombieModel.find();
  }

  async updateZombie(
    zombieId: string,
    updateZombieDto: UpdateZombieDto,
  ): Promise<Zombie> {
    const zombie = await this.getZombie(zombieId);

    // check if name is different
    if (zombie.name === updateZombieDto.name) {
      return zombie;
    }

    await this.validateNewZombieName(updateZombieDto.name);

    zombie.name = updateZombieDto.name;

    await zombie.save();

    return zombie;
  }

  async removeZombie(zombieId: string): Promise<Zombie> {
    const zombie = await this.getZombie(zombieId);
    await zombie.remove();
    return zombie;
  }

  private async validateNewZombieName(name: string) {
    // validate zombie name
    if (typeof name === 'undefined') {
      throw new HttpException(
        'Zombie name is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof name !== 'string') {
      throw new HttpException(
        'Zombie name has to be a string',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (name.length < 2) {
      throw new HttpException(
        'Zombie name has to have at leat 2 chars',
        HttpStatus.BAD_REQUEST,
      );
    }

    //check if name already exists
    if (await this.zombieModel.findOne({ name: name })) {
      throw new HttpException('Zombie name is taken', HttpStatus.BAD_REQUEST);
    }
  }
}

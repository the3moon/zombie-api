import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateZombieDto } from './dto/create.zombie.dto';
import { Zombie } from './schemas/zombie.schema';

@Injectable()
export class ZombiesService {
  constructor(@InjectModel(Zombie.name) private zombieModel: Model<Zombie>) {}

  async storeZombie(zombieDto: CreateZombieDto): Promise<Zombie> {
    // validate zombie name
    if (!('name' in zombieDto)) {
      throw new HttpException(
        'Zombie name is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof zombieDto.name !== 'string') {
      throw new HttpException(
        'Zombie name has to be a string',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (zombieDto.name.length < 2) {
      throw new HttpException(
        'Zombie name has to have at leat 2 chars',
        HttpStatus.BAD_REQUEST,
      );
    }

    //check if name already exists
    if (await this.zombieModel.findOne({ name: zombieDto.name })) {
      throw new HttpException('Zombie name is taken', HttpStatus.BAD_REQUEST);
    }

    const newZombie = new this.zombieModel({
      ...zombieDto,
      createdAt: new Date(),
    });

    await newZombie.save();

    return newZombie;
  }
}

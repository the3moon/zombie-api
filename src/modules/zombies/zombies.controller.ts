import { Controller } from '@nestjs/common';
import { ZombiesService } from './zombies.service';

@Controller('api/zombies')
export class ZombiesController {
  constructor(private zombiesService: ZombiesService) {}
}

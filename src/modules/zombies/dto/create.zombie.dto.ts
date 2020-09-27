import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateZombieDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

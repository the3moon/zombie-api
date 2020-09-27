import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateZombieDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}

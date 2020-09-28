import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsNumber()
  externalId: number;

  @IsNotEmpty()
  @IsMongoId()
  zombie: string;
}

import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateItemDto {
  @IsNotEmpty()
  @IsMongoId()
  zombie: string;
}

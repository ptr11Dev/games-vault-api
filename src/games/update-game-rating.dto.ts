import {
  IsArray,
  IsInt,
  IsOptional,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateGameRatingDto {
  @IsInt()
  id: number;

  @IsUrl()
  meta_url: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  metacritic: number | null;
}

export class UpdateGameRatingListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGameRatingDto)
  games: UpdateGameRatingDto[];
}

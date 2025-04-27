import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  id: number;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  released?: string;

  @IsOptional()
  @IsBoolean()
  tba?: boolean;

  @IsOptional()
  @IsString()
  background_image?: string;

  @IsOptional()
  @IsNumber()
  rawg_rating?: number;

  @IsOptional()
  @IsNumber()
  rawg_ratings_count?: number;

  @IsOptional()
  @IsNumber()
  metacritic?: number;

  @IsOptional()
  @IsString()
  updated?: string;

  @IsOptional()
  @IsArray()
  platforms?: string[];
}

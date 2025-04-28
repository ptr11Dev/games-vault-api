import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AvailablePlatforms } from './enums';

export class CreateGameDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  released?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  tba?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  background_image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rawg_rating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rawg_ratings_count?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  metacritic?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  updated?: string;

  @ApiProperty({
    required: false,
    type: [String],
    enum: AvailablePlatforms,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(AvailablePlatforms, { each: true })
  platforms?: AvailablePlatforms[];
}

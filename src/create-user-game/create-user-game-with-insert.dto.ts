import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserGameWithInsertDto {
  @ApiProperty({ example: 3498 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'grand-theft-auto-v' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Grand Theft Auto V' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2013-09-17', required: false })
  @IsOptional()
  @IsDateString()
  released?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  tba: boolean;

  @ApiProperty({
    example:
      'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  background_image?: string;

  @ApiProperty({
    example:
      'https://www.metacritic.com/game/horizon-forbidden-west-complete-edition/',
    required: false,
  })
  @IsOptional()
  @IsString()
  meta_url?: string;

  @ApiProperty({ example: 92, required: false })
  @IsOptional()
  @IsInt()
  metacritic?: number;

  @ApiProperty({ example: '2025-04-19T20:16:47' })
  @IsDateString()
  updated: string;

  @ApiProperty({ example: ['pc', 'playstation'], required: false })
  @IsOptional()
  platforms?: string[];
}

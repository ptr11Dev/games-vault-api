import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GameUserStatus {
  WISHLIST = 'wishlisted',
  PLATINUM = 'platinum',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  PLAYING = 'playing',
}

export class CreateUserGameDto {
  @ApiProperty({ example: 662318 })
  @IsNumber()
  gameId: number;

  @ApiProperty({ enum: GameUserStatus })
  @IsEnum(GameUserStatus)
  userStatus: GameUserStatus;
}

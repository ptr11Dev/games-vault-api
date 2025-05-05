import { IsEnum, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GameUserStatus {
  WISHLIST = 'wishlist',
  PLAYING = 'playing',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export class CreateUserGameDto {
  @ApiProperty({ example: 'b3b6a5ef-1234-4567-89ab-abcdef123456' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 662318 })
  @IsNumber()
  gameId: number;

  @ApiProperty({ enum: GameUserStatus })
  @IsEnum(GameUserStatus)
  userStatus: GameUserStatus;
}

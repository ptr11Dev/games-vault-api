import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UserGamesService } from './user-games.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';
import { GameUserStatus } from './create-user-game.dto';

@ApiTags('UserGames')
@Controller('user-games')
export class UserGamesController {
  constructor(private readonly userGamesService: UserGamesService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new game and link to user library (wishlisted)',
  })
  @ApiCreatedResponse({
    description: 'Game and user library entry created successfully.',
  })
  @ApiBody({ type: CreateUserGameWithInsertDto })
  async createWithInsert(@Body() dto: CreateUserGameWithInsertDto) {
    try {
      await this.userGamesService.createUserGameWithInsert(dto);
      return { message: 'Game and user library entry added successfully' };
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':userId/:gameId/status/:userStatus')
  @ApiOperation({ summary: 'Update user game status' })
  async updateStatus(
    @Param('userId') userId: string,
    @Param('gameId') gameId: number,
    @Param('userStatus') userStatus: GameUserStatus,
  ) {
    try {
      await this.userGamesService.updateUserGameStatus(
        userId,
        gameId,
        userStatus,
      );
      return { message: 'Game status updated successfully' };
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':userId/:gameId')
  @ApiOperation({ summary: 'Remove game from user library' })
  async remove(
    @Param('userId') userId: string,
    @Param('gameId') gameId: number,
  ) {
    try {
      await this.userGamesService.removeUserGame(userId, gameId);
      return { message: 'Game removed from library' };
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all games for user with optional filters' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiQuery({ name: 'status', required: false, enum: GameUserStatus })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'metacriticMin', required: false, type: Number })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['name', 'released', 'updatedAt', 'metacritic', 'status'],
  })
  @ApiQuery({ name: 'direction', required: false, enum: ['asc', 'desc'] })
  async getAll(
    @Param('userId') userId: string,
    @Query('status') status?: GameUserStatus,
    @Query('name') name?: string,
    @Query('metacriticMin') metacriticMin?: number,
    @Query('sort')
    sort?: 'name' | 'released' | 'updatedAt' | 'metacritic' | 'status',
    @Query('direction') direction?: 'asc' | 'desc',
  ) {
    try {
      return await this.userGamesService.getUserGames({
        userId,
        status,
        name,
        metacriticMin,
        sort,
        direction,
      });
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

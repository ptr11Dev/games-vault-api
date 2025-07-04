import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UserGamesService } from './user-games.service';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';
import { GameUserStatus } from './create-user-game.dto';
import { HandleHttpErrors } from '../common/decorators/handle-http-errors.decorator';
import { SORT_OPTIONS, SORT_DIRECTIONS } from './constants';

@ApiTags('UserGames')
@Controller('user-games')
export class UserGamesController {
  constructor(private readonly userGamesService: UserGamesService) {}

  @Post()
  @HandleHttpErrors()
  @ApiOperation({
    summary: 'Add new game and link to user library (wishlisted)',
  })
  @ApiCreatedResponse({
    description: 'Game and user library entry created successfully.',
  })
  @ApiBody({ type: CreateUserGameWithInsertDto })
  async createWithInsert(@Body() dto: CreateUserGameWithInsertDto) {
    await this.userGamesService.createUserGameWithInsert(dto);
    return { message: 'Game and user library entry added successfully' };
  }

  @Patch(':gameId/status/:userStatus')
  @HandleHttpErrors()
  @ApiOperation({ summary: 'Update user game status' })
  async updateStatus(
    @Param('gameId') gameId: number,
    @Param('userStatus') userStatus: GameUserStatus,
  ) {
    await this.userGamesService.updateUserGameStatus(gameId, userStatus);
    return { message: 'Game status updated successfully' };
  }

  @Delete(':gameId')
  @HandleHttpErrors()
  @ApiOperation({ summary: 'Remove game from user library' })
  async remove(@Param('gameId') gameId: number) {
    await this.userGamesService.removeUserGame(gameId);
    return { message: 'Game removed from library' };
  }

  @Get()
  @HandleHttpErrors()
  @ApiOperation({
    summary: 'Get all games for current user with optional filters',
  })
  @ApiQuery({ name: 'status', required: false, enum: GameUserStatus })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'metacriticMin', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: SORT_OPTIONS })
  @ApiQuery({ name: 'direction', required: false, enum: SORT_DIRECTIONS })
  async getAll(
    @Query('status') status?: GameUserStatus,
    @Query('name') name?: string,
    @Query('metacriticMin') metacriticMin?: number,
    @Query('sort') sort?: (typeof SORT_OPTIONS)[number],
    @Query('direction') direction?: (typeof SORT_DIRECTIONS)[number],
  ) {
    return await this.userGamesService.getUserGames({
      status,
      name,
      metacriticMin,
      sort,
      direction,
    });
  }
}

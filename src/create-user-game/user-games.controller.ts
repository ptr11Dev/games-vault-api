import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserGamesService } from './user-games.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';

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

  @Get(':userId')
  @ApiOperation({ summary: 'Get all games for user by ID' })
  @ApiParam({ name: 'userId', type: 'string' })
  async getAll(@Param('userId') userId: string) {
    try {
      return await this.userGamesService.getUserGames(userId);
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : 'Unknown error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

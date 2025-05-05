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
import { CreateUserGameDto } from './create-user-game.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('UserGames')
@Controller('user-games')
export class UserGamesController {
  constructor(private readonly userGamesService: UserGamesService) {}

  @Post()
  @ApiOperation({ summary: 'Add or update a game for user' })
  @ApiBody({ type: CreateUserGameDto })
  async add(@Body() body: CreateUserGameDto) {
    try {
      return await this.userGamesService.addUserGame(body);
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
    console.log('GET /user-games/:userId hit with id:', userId);
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

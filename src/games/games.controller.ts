import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GamesService } from './games.service';
import { HandleHttpErrors } from '../common/decorators/handle-http-errors.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateGameRatingListDto } from './update-game-rating.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @HandleHttpErrors()
  @ApiOperation({ summary: 'Get all game names' })
  async getAllGames() {
    return await this.gamesService.getAllGames();
  }

  @Patch('ratings')
  @ApiOperation({ summary: 'Update Metacritic ratings for multiple games' })
  @ApiBody({ type: UpdateGameRatingListDto })
  @ApiResponse({ status: 200, description: 'Ratings updated successfully' })
  async updateRatings(@Body() dto: UpdateGameRatingListDto) {
    await this.gamesService.updateRatings(dto.games);
    return { message: 'Ratings updated successfully' };
  }
}

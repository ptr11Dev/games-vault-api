import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateGameDto } from './create-game.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post()
  @ApiOperation({ summary: 'Add or update games (upsert)' })
  async upsertGames(@Body() body: CreateGameDto[]) {
    const { data, error } = await this.supabaseService.client
      .from('games')
      .upsert(body, { onConflict: 'id' });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }
}

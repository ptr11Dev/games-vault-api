import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, SupabaseService],
})
export class GamesModule {}

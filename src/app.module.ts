import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SupabaseService } from './supabase/supabase.service';
import { UserGamesController } from './create-user-game/user-games.controller';
import { UserGamesService } from './create-user-game/user-games.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, UserGamesController],
  providers: [SupabaseService, UserGamesService],
})
export class AppModule {}

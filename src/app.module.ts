import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase/supabase.service';
import { GamesController } from './game/games.controller';
import { UserGamesController } from './create-user-game/user-games.controller';
import { UserGamesService } from './create-user-game/user-games.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController, GamesController, UserGamesController],
  providers: [AppService, SupabaseService, UserGamesService],
})
export class AppModule {}

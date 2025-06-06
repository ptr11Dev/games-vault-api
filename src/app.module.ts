import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SupabaseService } from './supabase/supabase.service';
import { UserGamesController } from './create-user-game/user-games.controller';
import { UserGamesService } from './create-user-game/user-games.service';
import { SupabaseTokenMiddleware } from './supabase/supabase-token.middleware';
import { GamesModule } from './games/games.module';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GamesModule],
  controllers: [AppController, UserGamesController, GamesController],
  providers: [
    {
      provide: SupabaseService,
      useClass: SupabaseService,
      scope: Scope.REQUEST,
    },
    UserGamesService,
    GamesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupabaseTokenMiddleware).forRoutes('*');
  }
}

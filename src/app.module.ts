import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SupabaseService } from './supabase/supabase.service';
import { UserGamesController } from './create-user-game/user-games.controller';
import { UserGamesService } from './create-user-game/user-games.service';
import { SupabaseTokenMiddleware } from './supabase/supabase-token.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, UserGamesController],
  providers: [
    {
      provide: SupabaseService,
      useClass: SupabaseService,
      scope: Scope.REQUEST,
    },
    UserGamesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupabaseTokenMiddleware).forRoutes('*');
  }
}

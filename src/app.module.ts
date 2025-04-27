import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <---
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}

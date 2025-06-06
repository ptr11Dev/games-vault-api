import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GameApi } from 'src/create-user-game/user-game.types';

@Injectable()
export class GamesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private handleSupabaseError(error: unknown): void {
    if (error && typeof error === 'object' && 'message' in error) {
      throw new Error(String(error.message));
    }
    if (error) {
      throw new Error('An unknown error occurred');
    }
  }

  async getAllGames(): Promise<GameApi[]> {
    const { data, error } = (await this.supabaseService.client
      .from('games')
      .select('*')) as unknown as {
      data: GameApi[];
      error: Error | null;
    };

    this.handleSupabaseError(error);

    return data ?? [];
  }

  async updateRatings(
    games: { id: number; meta_url: string; metacritic: number | null }[],
  ) {
    const updates = games.map((g) =>
      this.supabaseService.client
        .from('games')
        .update({
          metacritic: g.metacritic,
          updated: new Date().toISOString(),
          meta_url: g.meta_url,
        })
        .eq('id', g.id),
    );

    const results = await Promise.all(updates);

    for (const { error } of results) {
      if (error) throw new Error(error.message);
    }
  }
}

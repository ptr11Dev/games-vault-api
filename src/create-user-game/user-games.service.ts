import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserGameDto } from './create-user-game.dto';
import { UserGame, UserGameRaw } from './user-game.types';

@Injectable()
export class UserGamesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async addUserGame(dto: CreateUserGameDto) {
    const { data, error } = await this.supabaseService.client
      .from('usergames')
      .upsert([dto], { onConflict: 'userId,gameId' });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUserGames(userId: string): Promise<UserGame[]> {
    const { data, error } = (await this.supabaseService.client
      .from('usergames')
      .select(
        `
        user_status,
        created_at,
        updated_at,
        games (
          id, slug, name, released, tba, background_image,
          rawg_rating, rawg_ratings_count, metacritic, updated, platforms
        )
      `,
      )
      .eq('user_id', userId)) as unknown as {
      data: UserGameRaw[];
      error: Error | null;
    };

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((entry) => {
      const game = entry.games;

      return {
        id: game.id,
        slug: game.slug,
        name: game.name,
        released: game.released ?? null,
        tba: game.tba,
        background_image: game.background_image ?? null,
        rawg_rating: game.rawg_rating,
        rawg_ratings_count: game.rawg_ratings_count,
        metacritic: game.metacritic ?? null,
        updated: game.updated,
        platforms: game.platforms ?? null,

        userStatus: entry.user_status,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      };
    });
  }
}

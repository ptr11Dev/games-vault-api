import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserGameDto, GameUserStatus } from './create-user-game.dto';
import { UserGame, UserGameRaw } from './user-game.types';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';

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

  async createUserGameWithInsert(
    dto: CreateUserGameWithInsertDto,
  ): Promise<void> {
    const {
      id,
      slug,
      name,
      released,
      tba,
      background_image,
      rawg_rating,
      rawg_ratings_count,
      metacritic,
      updated,
      platforms,
      userId,
    } = dto;

    const { error } = await this.supabaseService.client.rpc('add_user_game', {
      p_game_id: id,
      p_slug: slug,
      p_name: name,
      p_released: released,
      p_tba: tba,
      p_background_image: background_image ?? null,
      p_rawg_rating: rawg_rating,
      p_rawg_ratings_count: rawg_ratings_count,
      p_metacritic: metacritic ?? null,
      p_updated: updated,
      p_platforms: platforms ? JSON.stringify(platforms) : null,
      p_user_id: userId,
      p_user_status: 'wishlisted',
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateUserGameStatus(
    userId: string,
    gameId: number,
    userStatus: GameUserStatus,
  ): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('usergames')
      .update({ user_status: userStatus, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async removeUserGame(userId: string, gameId: number): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('usergames')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) {
      throw new Error(error.message);
    }
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

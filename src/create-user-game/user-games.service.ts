import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GameUserStatus } from './create-user-game.dto';
import { UserGame, UserGameRaw } from './user-game.types';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';

@Injectable()
export class UserGamesService {
  constructor(private readonly supabaseService: SupabaseService) {}

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

  async getUserGames(params: {
    userId: string;
    status?: GameUserStatus;
    name?: string;
    metacriticMin?: number;
    sort?: 'name' | 'released' | 'updatedAt' | 'metacritic' | 'status';
    direction?: 'asc' | 'desc';
  }): Promise<UserGame[]> {
    const { userId, ...filters } = params;

    let query = this.supabaseService.client
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
      .eq('user_id', userId);

    if (filters.status) {
      query = query.eq('user_status', filters.status);
    }

    if (filters.name) {
      query = query.ilike('games.name', `%${filters.name}%`);
    }

    if (filters.metacriticMin !== undefined) {
      query = query.gte('games.metacritic', filters.metacriticMin);
    }

    if (filters.sort === 'status') {
      const direction = filters.direction === 'desc' ? 'desc' : 'asc';
      query = query.order('user_status', { ascending: direction === 'asc' });
    } else if (filters.sort === 'updatedAt') {
      query = query.order('updated_at', {
        ascending: filters.direction !== 'desc',
      });
    }

    const { data, error } = (await query) as unknown as {
      data: UserGameRaw[];
      error: Error | null;
    };

    if (error) {
      throw new Error(error.message);
    }

    const mapped = (data ?? [])
      .filter((entry) => entry.games)
      .map((entry) => {
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

    if (['name', 'released', 'metacritic'].includes(filters.sort ?? '')) {
      const sortKey = filters.sort as keyof UserGame;
      mapped.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.direction === 'desc'
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.direction === 'desc'
            ? bValue - aValue
            : aValue - bValue;
        }

        return 0;
      });
    }

    return mapped;
  }
}

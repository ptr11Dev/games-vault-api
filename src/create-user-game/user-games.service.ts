import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GameUserStatus } from './create-user-game.dto';
import { UserGame, UserGameRaw } from './user-game.types';
import { CreateUserGameWithInsertDto } from './create-user-game-with-insert.dto';
import { UserGamesFilter } from './types/user-games.types';
import { DEFAULT_USER_STATUS } from './constants';

@Injectable()
export class UserGamesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private handleSupabaseError(error: unknown): void {
    if (error && typeof error === 'object' && 'message' in error) {
      throw new Error(String(error.message));
    }
    if (error) {
      throw new Error('An unknown error occurred');
    }
  }

  private buildUserGamesQuery(filters: UserGamesFilter) {
    let query = this.supabaseService.client.from('usergames').select(
      `
        user_status,
        created_at,
        updated_at,
        games (
          id, slug, name, released, tba, background_image,
          rawg_rating, rawg_ratings_count, metacritic, updated, platforms
        )
      `,
    );

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

    return query;
  }

  async createUserGameWithInsert(
    dto: CreateUserGameWithInsertDto,
  ): Promise<void> {
    const { error } = await this.supabaseService.client.rpc('add_user_game', {
      p_game_id: dto.id,
      p_slug: dto.slug,
      p_name: dto.name,
      p_released: dto.released,
      p_tba: dto.tba,
      p_background_image: dto.background_image ?? null,
      p_rawg_rating: dto.rawg_rating,
      p_rawg_ratings_count: dto.rawg_ratings_count,
      p_metacritic: dto.metacritic ?? null,
      p_updated: dto.updated,
      p_platforms: dto.platforms ? JSON.stringify(dto.platforms) : null,
      p_user_status: DEFAULT_USER_STATUS,
    });

    this.handleSupabaseError(error);
  }

  async updateUserGameStatus(
    gameId: number,
    userStatus: GameUserStatus,
  ): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('usergames')
      .update({ user_status: userStatus, updated_at: new Date().toISOString() })
      .eq('game_id', gameId);

    this.handleSupabaseError(error);
  }

  async removeUserGame(gameId: number): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('usergames')
      .delete()
      .eq('game_id', gameId);

    this.handleSupabaseError(error);
  }

  async getUserGames(params: UserGamesFilter): Promise<UserGame[]> {
    const { ...filters } = params;
    const query = this.buildUserGamesQuery(filters);

    const { data, error } = (await query) as unknown as {
      data: UserGameRaw[];
      error: Error | null;
    };

    this.handleSupabaseError(error);

    const mapped = (data ?? [])
      .filter((entry) => entry.games)
      .map((entry) => ({
        ...entry.games,
        released: entry.games.released ?? null,
        background_image: entry.games.background_image ?? null,
        metacritic: entry.games.metacritic ?? null,
        platforms: entry.games.platforms ?? null,
        userStatus: entry.user_status,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }));

    if (['name', 'released', 'metacritic'].includes(filters.sort ?? '')) {
      const sortKey = filters.sort as keyof UserGame;
      mapped.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (sortKey === 'metacritic') {
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
        }

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

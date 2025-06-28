import { AvailablePlatforms } from 'src/enums';
import { GameUserStatus } from './create-user-game.dto';

export type GameApi = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  meta_url: string | null;
  metacritic: number | null;
  updated: string;
  platforms: AvailablePlatforms[] | null;
};

export type UserGame = GameApi & {
  userStatus: GameUserStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserGameRaw = {
  user_status: GameUserStatus;
  created_at: string;
  updated_at: string;
  games: {
    id: number;
    slug: string;
    name: string;
    released: string | null;
    tba: boolean;
    background_image: string | null;
    meta_url: string | null;
    metacritic: number | null;
    updated: string;
    platforms: AvailablePlatforms[] | null;
  };
};

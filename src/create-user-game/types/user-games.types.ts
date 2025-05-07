import { GameUserStatus } from '../create-user-game.dto';
import { SORT_OPTIONS, SORT_DIRECTIONS } from '../constants';

export interface UserGamesFilter {
  userId: string;
  status?: GameUserStatus;
  name?: string;
  metacriticMin?: number;
  sort?: (typeof SORT_OPTIONS)[number];
  direction?: (typeof SORT_DIRECTIONS)[number];
}

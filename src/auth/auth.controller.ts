import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns current user data.' })
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userFromDb = await this.supabaseService.getUserById(req.user.userId);

    return {
      userId: req.user.userId,
      email: req.user.email,
      profile: userFromDb,
    };
  }
}

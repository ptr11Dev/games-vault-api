import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedData(@Req() req: AuthenticatedRequest) {
    return { message: 'You are authorized', user: req.user };
  }
}

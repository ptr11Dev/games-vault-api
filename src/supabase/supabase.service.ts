import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
  }

  get client() {
    return this.supabase;
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase.auth.admin.getUserById(userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

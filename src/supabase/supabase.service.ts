import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config'; // <-- dodaj

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single<{ id: string; [key: string]: any }>();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

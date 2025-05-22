// src/supabase/supabase.service.ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface RequestWithAuth {
  supabaseAccessToken: string;
}

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject('REQUEST') private readonly req: RequestWithAuth) {
    const token = this.req.supabaseAccessToken;

    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}

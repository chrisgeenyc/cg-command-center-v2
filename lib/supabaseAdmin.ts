/*
  Supabase SQL schema — run once in the Supabase SQL editor
  ──────────────────────────────────────────────────────────

  create table if not exists projects_snapshot (
    id        bigserial primary key,
    data      jsonb,
    synced_at timestamptz default now()
  );

  create table if not exists pipeline_snapshot (
    id        bigserial primary key,
    data      jsonb,
    synced_at timestamptz default now()
  );

  create table if not exists pulse_snapshot (
    id        bigserial primary key,
    data      jsonb,
    synced_at timestamptz default now()
  );

  create table if not exists quickies (
    id           uuid primary key default gen_random_uuid(),
    who          text,
    ctx          text,
    action       text,
    channel      text default 'email',
    trigger_text text,
    tint         text default 'yellow',
    rel          text,
    touch        text,
    temp         text default 'warm',
    done         boolean default false,
    pinned       boolean default false,
    created_at   timestamptz default now(),
    updated_at   timestamptz default now()
  );

  create table if not exists briefing_stories (
    id uuid primary key default gen_random_uuid(),
    brief_type text not null,
    section text default 'top-stories',
    headline text,
    url text,
    publication text,
    published_date text,
    summary text,
    synced_at timestamptz default now()
  );
*/

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase env vars not set');
    _adminClient = createClient(url, key);
  }
  return _adminClient;
}

// Convenience alias — lazy-initialised on first call
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  },
});

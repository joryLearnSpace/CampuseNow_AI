-- CampusNow AI minimal database schema
-- Run this in the Supabase SQL Editor for your prototype.

create extension if not exists pgcrypto;

create table if not exists campus_locations (
    id text primary key,
    name text not null,
    active boolean not null default true
);

create table if not exists checkins (
    id uuid primary key default gen_random_uuid(),
    user_id text not null,
    location_id text not null references campus_locations(id),
    checked_in_at timestamptz not null default now(),
    expires_at timestamptz not null,
    active boolean not null default true
);

create index if not exists idx_checkins_location_expiry
on checkins(location_id, expires_at);

create table if not exists campus_requests (
    id uuid primary key default gen_random_uuid(),
    requester_id text not null,
    location_id text not null references campus_locations(id),
    question text not null,
    category text not null,
    status text not null,
    routing_json jsonb not null,
    verification_json jsonb,
    created_at timestamptz not null default now()
);

create table if not exists community_responses (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references campus_requests(id) on delete cascade,
    responder_id text not null,
    answer text not null,
    presence_verified boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists reputation (
    user_id text primary key,
    points integer not null default 0,
    trust_score integer not null default 50 check (trust_score between 0 and 100),
    updated_at timestamptz not null default now()
);

create table if not exists human_reviews (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references campus_requests(id) on delete cascade,
    review_type text not null,
    status text not null default 'pending',
    payload_json jsonb not null,
    reviewer_id text,
    feedback text,
    created_at timestamptz not null default now(),
    reviewed_at timestamptz
);

create table if not exists agent_logs (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references campus_requests(id) on delete cascade,
    agent_name text not null,
    payload_json jsonb not null,
    created_at timestamptz not null default now()
);

-- Example locations:
insert into campus_locations (id, name)
values
    ('central-library', 'Central Library'),
    ('computing-building', 'Computing Building'),
    ('student-services', 'Student Services')
on conflict (id) do nothing;

-- IMPORTANT:
-- The Python backend uses the SERVICE ROLE key, so keep that key server-side only.
-- Your production React app should authenticate users through Supabase Auth.
-- Do not expose the service-role key to the browser.

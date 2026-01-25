-- Migration script to update database for event-only registration
-- Run this AFTER the main database-schema.sql

-- Make team-related columns nullable in registrations table (if they cause issues)
ALTER TABLE public.registrations
ALTER COLUMN team_name
DROP NOT NULL,
ALTER COLUMN team_size
SET DEFAULT 1;

-- Update event_type constraint to only allow 'event' (optional - only if you want to enforce at DB level)
-- ALTER TABLE public.registrations
--   DROP CONSTRAINT IF EXISTS registrations_event_type_check,
--   ADD CONSTRAINT registrations_event_type_check CHECK (event_type IN ('event'));

-- Ensure RLS policies are permissive for all tables
DROP POLICY IF EXISTS "Enable all for profiles" ON public.profiles;

CREATE POLICY "Enable all for profiles" ON public.profiles FOR ALL USING (true)
WITH
    CHECK (true);

DROP POLICY IF EXISTS "Enable all for registrations" ON public.registrations;

CREATE POLICY "Enable all for registrations" ON public.registrations FOR ALL USING (true)
WITH
    CHECK (true);

DROP POLICY IF EXISTS "Enable all for team_members" ON public.team_members;

CREATE POLICY "Enable all for team_members" ON public.team_members FOR ALL USING (true)
WITH
    CHECK (true);

DROP POLICY IF EXISTS "Enable all for team_join_requests" ON public.team_join_requests;

CREATE POLICY "Enable all for team_join_requests" ON public.team_join_requests FOR ALL USING (true)
WITH
    CHECK (true);

DROP POLICY IF EXISTS "Enable all for registration_checkins" ON public.registration_checkins;

CREATE POLICY "Enable all for registration_checkins" ON public.registration_checkins FOR ALL USING (true)
WITH
    CHECK (true);

DROP POLICY IF EXISTS "Enable all for team_member_checkins" ON public.team_member_checkins;

CREATE POLICY "Enable all for team_member_checkins" ON public.team_member_checkins FOR ALL USING (true)
WITH
    CHECK (true);

-- Add event control for event registration (if not exists)
INSERT INTO
    public.event_controls (key, value, updated_at)
VALUES (
        'event_registration',
        'active',
        NOW()
    ) ON CONFLICT (key) DO
UPDATE
SET
    value = 'active',
    updated_at = NOW();

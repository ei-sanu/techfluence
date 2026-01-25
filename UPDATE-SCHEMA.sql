-- Direct SQL commands to update existing schema for event-only registration
-- Run these commands in your Supabase SQL Editor

-- 1. Ensure RLS policies allow all operations (fixes 406 errors)
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

-- 2. Optional: Update event control for event registration
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

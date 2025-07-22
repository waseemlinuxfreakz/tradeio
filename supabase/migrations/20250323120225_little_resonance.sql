/*
  # Seed Database with Demo Data
  
  1. Creates demo users and profiles with unique emails
  2. Creates sample signals with metadata
  3. Creates signal enrollments
  4. Adds general course permissions
  
  Note: Handles trigger function creation and RLS management with CASCADE
*/

BEGIN;

-- Disable RLS temporarily
SELECT disable_rls();

-- Drop existing trigger and function with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS handle_new_user ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user ON user_profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create the trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the profile doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = NEW.id) THEN
    BEGIN
      INSERT INTO user_profiles (
        id,
        full_name,
        role,
        status,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        'pending',
        NOW(),
        NOW()
      );
    EXCEPTION WHEN unique_violation THEN
      -- Ignore duplicate key violations
      NULL;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create users first in auth schema with a CTE to store IDs
WITH inserted_users AS (
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  )
  SELECT 
    gen_random_uuid(),
    'demo_user_' || i || '_' || substr(gen_random_uuid()::text, 1, 8) || '@example.com',
    crypt('password123', gen_salt('bf')),
    NOW() - (random() * INTERVAL '365 days'),
    NOW() - (random() * INTERVAL '365 days'),
    NOW()
  FROM generate_series(1, 500) i
  RETURNING id, email, created_at
)
-- Create user profiles using the same IDs from auth.users
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  status,
  created_at,
  updated_at
)
SELECT 
  id,
  'User ' || ROW_NUMBER() OVER (ORDER BY created_at),
  (ARRAY['student', 'instructor', 'admin'])[1 + (random() * 2)::INTEGER],
  (ARRAY['pending', 'active', 'suspended'])[1 + (random() * 2)::INTEGER],
  created_at,
  NOW()
FROM inserted_users
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Create signals with unique IDs
WITH signal_data AS (
  SELECT 
    'SIGNAL_' || i || '_' || substr(gen_random_uuid()::text, 1, 8) as signal_id,
    (SELECT id FROM user_profiles ORDER BY random() LIMIT 1) as creator_id,
    (ARRAY['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'TON/USDT', 'BNB/USDT'])[1 + (random() * 4)::INTEGER] as pair,
    (ARRAY['LONG', 'SHORT'])[1 + (random()::INTEGER)] as signal_type,
    (ARRAY[45000, 3000, 100, 2.5, 350])[1 + (random() * 4)::INTEGER] as base_price,
    NOW() - (random() * INTERVAL '30 days') as created_time
  FROM generate_series(1, 100) i
)
INSERT INTO course_permissions (course_id, role, permissions)
SELECT 
  signal_id,
  'instructor',
  jsonb_build_object(
    'pair', pair,
    'type', signal_type,
    'entry_price', (base_price * (1 + random() * 0.1))::NUMERIC(10,2),
    'take_profit', (base_price * (1 + random() * 0.2))::NUMERIC(10,2),
    'stop_loss', (base_price * (1 - random() * 0.1))::NUMERIC(10,2),
    'consensus', (random() * 100)::INTEGER,
    'votes', (random() * 1000)::INTEGER,
    'success_rate', (random() * 100)::INTEGER,
    'description', CASE (random() * 4)::INTEGER
      WHEN 0 THEN 'Strong bullish momentum with increasing volume'
      WHEN 1 THEN 'Key resistance level breakout confirmed'
      WHEN 2 THEN 'Multiple technical indicators showing buy signals'
      WHEN 3 THEN 'Bear trap formation with high volume'
      ELSE 'Double bottom pattern completed'
    END
  )
FROM signal_data;

-- Create enrollments for the signals
WITH signal_data AS (
  SELECT 
    course_id as signal_id,
    (SELECT id FROM user_profiles ORDER BY random() LIMIT 1) as user_id,
    NOW() - (random() * INTERVAL '30 days') as created_time
  FROM course_permissions
  WHERE course_id LIKE 'SIGNAL_%'
)
INSERT INTO course_enrollments (user_id, course_id, status, progress, created_at, updated_at)
SELECT 
  user_id,
  signal_id,
  CASE 
    WHEN random() > 0.7 THEN 'completed'
    WHEN random() > 0.4 THEN 'enrolled'
    ELSE 'dropped'
  END,
  (random() * 100)::INTEGER,
  created_time,
  NOW()
FROM signal_data;

-- Add general course permissions
INSERT INTO course_permissions (course_id, role, permissions)
SELECT 
  'COURSE_' || i || '_' || substr(gen_random_uuid()::text, 1, 8),
  (ARRAY['student', 'instructor', 'admin'])[1 + (random() * 2)::INTEGER],
  jsonb_build_object(
    'can_view', true,
    'can_edit', random() > 0.5,
    'can_delete', random() > 0.8
  )
FROM generate_series(1, 100) i;

-- Re-enable RLS
SELECT enable_rls();

-- Create the trigger on auth.users
CREATE TRIGGER handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

COMMIT;
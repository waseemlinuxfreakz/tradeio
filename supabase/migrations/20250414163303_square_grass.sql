/*
  # Create Test User Migration
  
  1. New Tables
    - Creates a test user in auth.users if not exists
    - Creates or updates corresponding user profile
  
  2. Security
    - Sets up secure password hashing
    - Maintains referential integrity
    - Handles duplicate key conflicts gracefully
*/

-- Create test user with explicit UUID
DO $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  existing_user_id uuid;
BEGIN
  -- Check if user already exists and get their ID
  SELECT id INTO existing_user_id
  FROM auth.users 
  WHERE email = 'EW5933070@GMAIL.COM';

  -- Create test user if it doesn't exist
  IF existing_user_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      aud,
      role
    ) VALUES (
      test_user_id,
      '00000000-0000-0000-0000-000000000000',
      'EW5933070@GMAIL.COM',
      crypt('ADMIN123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO existing_user_id;
  END IF;

  -- Create or update user profile using the existing or new user ID
  INSERT INTO user_profiles (
    id,
    full_name,
    role,
    status,
    created_at,
    updated_at
  ) VALUES (
    existing_user_id,
    'Admin User',
    'admin',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = NOW();
END $$;
/*
  # Fix authentication schema

  1. Schema Changes
    - Enable auth schema extensions if not enabled
    - Create auth schema tables if missing
    - Add RLS policies for proper authentication

  2. Security
    - Enable RLS on auth tables
    - Add policies for authenticated users
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
  ) THEN
    CREATE TABLE auth.users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      email text UNIQUE NOT NULL,
      encrypted_password text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can read own data in auth.users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Update user_profiles foreign key if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_id_fkey'
  ) THEN
    ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
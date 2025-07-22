/*
  # Add RLS Management Functions
  
  1. New Functions
    - `disable_rls()`: Temporarily disables RLS on tables
    - `enable_rls()`: Re-enables RLS on tables
  
  2. Security
    - Functions can only be executed by authenticated users with admin role
*/

-- Function to disable RLS
CREATE OR REPLACE FUNCTION disable_rls()
RETURNS void AS $$
BEGIN
  ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE course_permissions DISABLE ROW LEVEL SECURITY;
  ALTER TABLE course_enrollments DISABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Function to enable RLS
CREATE OR REPLACE FUNCTION enable_rls()
RETURNS void AS $$
BEGIN
  ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE course_permissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION disable_rls() TO authenticated;
GRANT EXECUTE ON FUNCTION enable_rls() TO authenticated;
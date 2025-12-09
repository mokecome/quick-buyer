-- ============================================
-- Quick Buyer - Admin Permission Setup
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- Step 1: Create users table for storing roles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Step 4: Create trigger to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN NEW.email = 'mokecome@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Insert existing users into users table (if any)
INSERT INTO users (id, email, role)
SELECT
  id,
  email,
  CASE
    WHEN email = 'mokecome@gmail.com' THEN 'admin'
    ELSE 'user'
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = CASE
    WHEN EXCLUDED.email = 'mokecome@gmail.com' THEN 'admin'
    ELSE users.role  -- Keep existing role for non-admin users
  END,
  updated_at = NOW();

-- Step 6: Add admin RLS policies to projects table
-- Admin can view all projects (including pending/rejected)
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can update all projects
DROP POLICY IF EXISTS "Admins can update all projects" ON projects;
CREATE POLICY "Admins can update all projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can delete all projects
DROP POLICY IF EXISTS "Admins can delete all projects" ON projects;
CREATE POLICY "Admins can delete all projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Verification
-- ============================================
SELECT 'Users table created' AS status;
SELECT COUNT(*) as total_users FROM users;
SELECT email, role FROM users ORDER BY role DESC, email;

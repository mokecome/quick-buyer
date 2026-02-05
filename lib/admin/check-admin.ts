import { SupabaseClient } from '@supabase/supabase-js'

// Admin emails from environment variable (comma-separated) with fallback
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'mokecome@gmail.com')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

/**
 * Check if a user is an admin by their email
 * This is a simple check that can be used before database lookup
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Check if the current user is an admin
 * First checks the users table for role, falls back to email check
 */
export async function isAdmin(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<boolean> {
  // Quick check by email first
  if (userEmail && isAdminEmail(userEmail)) {
    return true
  }

  // Check database for role (if users table exists)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (!error && data?.role === 'admin') {
      return true
    }
  } catch {
    // Table might not exist yet, fall back to email check
  }

  return false
}

/**
 * Check admin status and return user info
 */
export async function checkAdminStatus(supabase: SupabaseClient): Promise<{
  isAdmin: boolean
  user: { id: string; email?: string } | null
}> {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { isAdmin: false, user: null }
  }

  const adminStatus = await isAdmin(supabase, user.id, user.email)

  return {
    isAdmin: adminStatus,
    user: { id: user.id, email: user.email }
  }
}

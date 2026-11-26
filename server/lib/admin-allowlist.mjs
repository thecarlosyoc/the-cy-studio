// Admin allowlist for /api/admin/*. The list is the env var ADMIN_USER_IDS: Supabase
// user IDs (auth.users.id), separated by commas or whitespace.
//
// IDs rather than emails: an ID never changes and cannot be claimed by signing up,
// while an email on the list that has no account yet could be registered by anyone
// while public sign-up is open.
//
// Deny by default: a missing or empty list admits nobody.
export function isAdminUserId(userId, allowlist) {
  if (typeof userId !== 'string' || userId === '') return false
  if (typeof allowlist !== 'string') return false

  const id = userId.trim().toLowerCase()
  return allowlist
    .split(/[\s,]+/)
    .map((entry) => entry.toLowerCase())
    .some((entry) => entry !== '' && entry === id)
}

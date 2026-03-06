/**
 * Returning visitor detection via localStorage.
 *
 * Tracks whether the user has visited before to skip boot+login
 * on subsequent visits. Degrades gracefully when localStorage is
 * blocked (private browsing, etc.)
 */

// ── Constants ───────────────────────────────────────────────

const VISITED_KEY = "air-portfolio-visited";

// ── Public API ──────────────────────────────────────────────

/**
 * Check if this is a returning visitor.
 * Returns false if localStorage is unavailable.
 */
export function isReturningVisitor(): boolean {
  try {
    return localStorage.getItem(VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Mark current visitor as returning for future sessions.
 * Silent no-op if localStorage is blocked.
 */
export function markAsReturningVisitor(): void {
  try {
    localStorage.setItem(VISITED_KEY, "1");
  } catch {
    // Silent fail — localStorage blocked (private browsing, etc.)
  }
}

/**
 * Clear returning visitor flag.
 * Used by the `replay` command to re-show boot+login.
 */
export function clearReturningVisitor(): void {
  try {
    localStorage.removeItem(VISITED_KEY);
  } catch {
    // Silent fail
  }
}

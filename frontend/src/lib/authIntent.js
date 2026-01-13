/**
 * Authentication Intent Management
 * Professional-grade intent tracking for post-auth redirects
 */

const INTENT_KEY = 'auth_intent';

export const AUTH_INTENTS = {
  GET_STARTED: 'get_started',
  START_CODING: 'start_coding',
  EXPLORE_PROBLEMS: 'explore_problems',
};

/**
 * Store user intent before authentication
 */
export function setAuthIntent(intent) {
  if (!Object.values(AUTH_INTENTS).includes(intent)) {
    console.warn(`Invalid auth intent: ${intent}`);
    return;
  }
  localStorage.setItem(INTENT_KEY, intent);
}

/**
 * Retrieve and clear stored intent
 */
export function getAuthIntent() {
  const intent = localStorage.getItem(INTENT_KEY);
  if (intent) {
    localStorage.removeItem(INTENT_KEY);
  }
  return intent;
}

/**
 * Clear intent without retrieving
 */
export function clearAuthIntent() {
  localStorage.removeItem(INTENT_KEY);
}

/**
 * Get redirect URL based on intent
 */
export function getRedirectForIntent(intent) {
  switch (intent) {
    case AUTH_INTENTS.GET_STARTED:
      return '/dashboard?new=true';
    case AUTH_INTENTS.START_CODING:
      return '/dashboard';
    case AUTH_INTENTS.EXPLORE_PROBLEMS:
      return '/problems';
    default:
      return '/dashboard';
  }
}

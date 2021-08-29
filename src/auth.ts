import { Store } from './store';
import { fetch } from './utils';

export function createAuthorizationHeader(token: string): string {
  return `Bearer ${token}`;
}

export async function validateToken(token: string): Promise<boolean> {
  const groupUrl = `groups/${Store.config.accountName}`;
  const headers = {
    authorization: createAuthorizationHeader(token),
  };

  try {
    await fetch(groupUrl, { headers });
    return true;
  } catch (_) {
    return false;
  }
}

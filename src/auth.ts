import { fetch } from './utils';

export function createAuthorizationHeader(token: string): string {
  return `Bearer ${token}`;
}

export async function validateToken(token: string): Promise<boolean> {
  const testUrl = `version?simple=true`;
  const headers = {
    authorization: createAuthorizationHeader(token),
  };

  try {
    await fetch(testUrl, { headers });
    return true;
  } catch (_) {
    return false;
  }
}

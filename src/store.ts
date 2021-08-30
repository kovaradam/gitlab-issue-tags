import { RepoConfig } from './repo-config';
import { ExtensionContext } from 'vscode';

export class Store {
  static config: RepoConfig;
  private static context: ExtensionContext;

  static async getGitlabToken(): Promise<string | null> {
    const key = Store.getTokenStoreKey();
    const token = await Store.context.secrets.get(key);
    return token ?? null;
  }

  static async setGitlabToken(newToken: string): Promise<void> {
    const key = Store.getTokenStoreKey();
    return await Store.context.secrets.store(key, newToken);
  }

  static setContext(newContext: typeof Store.context): void {
    Store.context = newContext;
  }

  static getTokenStoreKey(): string {
    const tokenServiceKey = 'gitlab-issue-tags-extension';
    return `${tokenServiceKey}-${Store.config.url}`;
  }
}

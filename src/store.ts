import { RepoConfig } from './repo-config';
import { ExtensionContext } from 'vscode';

export class Store {
  static config: RepoConfig;
  private static context: ExtensionContext;

  static getGitlabToken(): string | null {
    return Store.context.globalState.get(Store.getTokenStoreKey()) ?? null;
  }

  static setGitlabToken(newToken: string): void {
    Store.context.globalState.update(Store.getTokenStoreKey(), newToken);
  }

  static setContext(newContext: typeof Store.context): void {
    Store.context = newContext;
  }

  static getTokenStoreKey(): string {
    return `token-${Store.config.url}`;
  }
}

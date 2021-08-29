import { RepoConfig } from './repo-config';
import vscode from 'vscode';

type State =
  | 'OK'
  | 'AUTHORIZING'
  | 'FAILED_AUTH'
  | 'FETCHING'
  | 'UNAUTHORIZED'
  | 'ERROR'
  | 'INACTIVE';

const gitlabTokenStoreKey = 'gitlab-token';

export class Store {
  static config: RepoConfig;
  private static state: State = 'INACTIVE';
  private static context: vscode.ExtensionContext;

  static isState(state: State): boolean {
    return Store.state === state;
  }

  static setState(newState: State): void {
    console.debug('[Store] new state:', newState);
    Store.state = newState;
  }

  static getGitlabToken(): string {
    return Store.context.workspaceState.get(gitlabTokenStoreKey) ?? '';
  }
  static setGitlabToken(newToken: string): void {
    Store.context.workspaceState.update(gitlabTokenStoreKey, newToken);
  }

  static setContext(newContext: typeof Store.context): void {
    Store.context = newContext;
  }
}

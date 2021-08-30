import { commands, ExtensionContext } from 'vscode';
import { getRepoConfig } from './repo-config';
import { Store } from './store';
import { View } from './view';

export function activate(context: ExtensionContext): void {
  Store.setContext(context);

  let configError: string;
  try {
    Store.config = getRepoConfig();
  } catch (error) {
    configError = String(error);
  }

  async function run(): Promise<void> {
    if (!Store.config) {
      View.showMessage.error(configError);
      return;
    }

    const hasValidToken = (await Store.getGitlabToken()) !== null;

    if (!hasValidToken) {
      View.showAuthDialog().then((token) => {
        if (token === null) {
          return;
        }
        Store.setGitlabToken(token).then(View.showIssues);
      });
      return;
    }

    View.showIssues();
  }

  async function setGitlabToken(): Promise<void> {
    View.showAuthDialog().then((token) => {
      if (token === null) {
        return;
      }
      Store.setGitlabToken(token);
    });
  }

  const disposables = [
    commands.registerCommand('extension.gitlab-issues', run),
    commands.registerCommand('extension.gitlab-issues-token', setGitlabToken),
  ];

  context.subscriptions.push(...disposables);
}

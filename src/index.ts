import * as vscode from 'vscode';
import { validateToken } from './auth';
import { getRepoConfig } from './repo-config';
import { Store } from './store';
import * as V from './view';

const { window, commands } = vscode;

// this function is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  Store.setContext(context);

  let getConfigError: string;
  try {
    Store.config = getRepoConfig();
  } catch (error) {
    getConfigError = String(error);
  }

  async function run(): Promise<void> {
    if (!Store.config) {
      window.showErrorMessage(getConfigError);
      return;
    }

    const hasValidToken = await validateToken(Store.getGitlabToken());
    Store.setState(hasValidToken ? 'OK' : 'UNAUTHORIZED');

    if (Store.isState('UNAUTHORIZED')) {
      V.handleAuth().then((token) => {
        if (token === null) {
          return;
        }
        Store.setGitlabToken(token);
        Store.setState('OK');
      });
      return;
    }

    V.showIssues();
  }
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = commands.registerCommand('extension.gitlab-issues', run);

  context.subscriptions.push(disposable);
}

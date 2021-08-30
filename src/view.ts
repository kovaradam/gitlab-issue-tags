import { QuickPickItem, window } from 'vscode';
import { validateToken } from './auth';
import clipboardy from 'clipboardy';
import { getIssues, IssueData } from './issues';

export const View = {
  showMessage: {
    info: (message: string): void => showMessage(message, 'info'),
    error: (message: string): void => showMessage(message, 'error'),
    warn: (message: string): void => showMessage(message, 'warn'),
  },
  showAuthDialog: async (): Promise<string | null> => {
    return window
      .showInputBox({
        prompt: 'Please insert your GitLab token',
        placeHolder: 'GitLab token',
      })
      .then(async (responseToken) => {
        if (responseToken === undefined) {
          showMessage.error('Validation aborted');
          return null;
        }
        showMessage.info('Validating token');
        const isTokenValid = await validateToken(responseToken);
        if (!isTokenValid) {
          showMessage.error('Provided token is invalid');
          return null;
        }
        showMessage.info('Your token is valid');
        return responseToken;
      });
  },

  showIssues: async (): Promise<void> => {
    const pick = window.createQuickPick<QuickPickItem & IssueData>();
    pick.title = 'Select Issue';
    pick.busy = true;
    pick.matchOnDescription = true;
    pick.show();

    const issues = await getIssues();
    pick.busy = false;

    if (issues === null) {
      pick.dispose();
      return;
    }

    if (issues.length === 0) {
      showMessage.warn('Could not find any issues');
    }

    pick.items = issues.map((issue) => ({
      label: `${issue.iid}: ${issue.title}`,
      ...issue,
    }));

    pick.onDidChangeSelection(([issue]) => {
      if (issue === undefined) {
        pick.dispose();
        return;
      }
      const issueTag = `#${issue.iid}`;
      clipboardy.writeSync(issueTag);
      showMessage.info(`Copied '${issueTag}' to clipboard`);
      pick.dispose();
    });
  },
};

function showMessage(content: string, type: 'info' | 'error' | 'warn' = 'info'): void {
  const message = `[Gitlab Issues] ${content}`;

  switch (type) {
    case 'error':
      window.showErrorMessage(message);
      return;
    case 'warn':
      window.showWarningMessage(message);
      return;
    default:
      window.showInformationMessage(message);
  }
}
showMessage.info = (message: string): void => showMessage(message, 'info');
showMessage.error = (message: string): void => showMessage(message, 'error');
showMessage.warn = (message: string): void => showMessage(message, 'warn');

import { window } from 'vscode';
import { validateToken } from './auth';
import { createMessage } from './utils';
import clipboardy from 'clipboardy';
import { getIssues, IssueData } from './issues';
import { title } from 'process';

export async function handleAuth(): Promise<string | null> {
  return window
    .showInputBox({
      prompt: 'Please insert your GitLab token',
      placeHolder: 'GitLab token',
    })
    .then(async (responseToken) => {
      if (responseToken === undefined) {
        showMessage('Validation aborted');
        return null;
      }
      showMessage('Validating token');
      const isTokenValid = await validateToken(responseToken);
      if (!isTokenValid) {
        showMessage('Provided token is invalid', 'error');
        return null;
      }
      showMessage('Your token is valid');
      return responseToken;
    });
}

export async function showIssues(): Promise<void> {
  const issues = (await getIssues()) ?? [];
  if (issues.length === 0) {
    showMessage('Could not find any issues', 'warning');
  }

  function formatIssue({ iid, title }: IssueData): string {
    return `${iid}: ${title}`;
  }
  function getIssueTag(title: string): string {
    const issueNumber = title.slice(0, title.indexOf(':'));
    return `#${issueNumber}`;
  }

  window
    .showQuickPick(issues.map(formatIssue), { title: 'Select Issue' })
    .then(async (issueTitle) => {
      if (issueTitle === undefined) {
        return;
      }
      const issueTag = getIssueTag(issueTitle);
      await clipboardy.write(issueTag);
      showMessage(`Copied '${issueTag}' to clipboard`);
    });
}

export function showMessage(
  content: string,
  type: 'info' | 'error' | 'warning' = 'info',
): void {
  const message = createMessage(content);

  ((): typeof window.showErrorMessage => {
    switch (type) {
      case 'error':
        return window.showErrorMessage;
      case 'warning':
        return window.showWarningMessage;
      default:
        return window.showInformationMessage;
    }
  })()(message);
}

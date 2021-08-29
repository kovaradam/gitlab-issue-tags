import fs from 'fs';
import { workspace } from 'vscode';

function loadRepoConfig(): Buffer {
  const directoryPath = workspace.workspaceFolders?.[0]?.uri.path;

  if (!directoryPath) {
    throw Error('Could not access workspace folder');
  }

  const gitConfigPath = `${directoryPath}/.git/config`;

  try {
    return fs.readFileSync(gitConfigPath);
  } catch (error) {
    throw Error(String(error));
  }
}

function parseRepoConfig(configFile: Buffer): {
  url: string;
  accountName: string;
  projectName: string;
} {
  const configString = configFile.toString();
  const [urlAttributeSelector, appendix] = ['url = ', '.git'];
  const urlIdx = configString.indexOf(urlAttributeSelector);

  if (urlIdx === -1) {
    throw Error;
  }

  const gitUrl = configString.slice(
    urlIdx + urlAttributeSelector.length,
    configString.indexOf(appendix) + appendix.length,
  );
  const [groupSeparator, projectSeparator] = [':', '/'];
  const origin = gitUrl.slice('git@'.length, gitUrl.indexOf(groupSeparator));

  const httpUrl = `https://${origin}`;
  const accountName = gitUrl.slice(
    gitUrl.indexOf(groupSeparator) + groupSeparator.length,
    gitUrl.indexOf('/'),
  );

  const projectName = gitUrl.slice(
    gitUrl.lastIndexOf(projectSeparator) + projectSeparator.length,
    gitUrl.indexOf(appendix),
  );

  return { url: httpUrl, accountName, projectName };
}

export const test = (): void => {
  const configFile = loadRepoConfig();
  const config = parseRepoConfig(configFile);
  console.log(config);
};

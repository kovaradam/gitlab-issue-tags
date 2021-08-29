import { Store } from './store';
import { fetch } from './utils';
import * as V from './view';

type ProjectData = { id: string };
export type IssueData = { iid: string; title: string };

export async function getIssues(): Promise<IssueData[] | null> {
  const { projectName } = Store.config;
  const projectSearchUrl = `projects?search=${projectName}`;
  const projectsErrorMessage = 'Could not find any projects';
  const errorValue = null;

  let projects: ProjectData[];
  try {
    projects = (await fetch<ProjectData[]>(projectSearchUrl)).data;
  } catch (error) {
    V.showMessage(projectsErrorMessage, 'error');
    return errorValue;
  }

  const projectId = projects?.[0]?.id;
  if (projectId === undefined) {
    V.showMessage(projectsErrorMessage, 'error');
    return errorValue;
  }

  const issuesSearchUrl = `projects/${projectId}/issues`;
  const issues = (await fetch<IssueData[]>(issuesSearchUrl)).data;

  return issues;
}

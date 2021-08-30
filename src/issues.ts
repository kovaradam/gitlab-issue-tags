import { Store } from './store';
import { fetch } from './utils';
import { View } from './view';

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
    View.showMessage.error(projectsErrorMessage);
    return errorValue;
  }

  const projectId = projects?.[0]?.id;
  if (projectId === undefined) {
    View.showMessage.error(projectsErrorMessage);
    return errorValue;
  }

  const issuesSearchUrl = `projects/${projectId}/issues?simple=true`;
  const issues = (await fetch<IssueData[]>(issuesSearchUrl)).data;

  return issues;
}

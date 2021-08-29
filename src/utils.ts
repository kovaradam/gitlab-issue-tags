import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { window } from 'vscode';
import { createAuthorizationHeader } from './auth';
import { Store } from './store';

export function createMessage(content: string): string {
  return `Gitlab Issues - ${content}`;
}

export function fetch<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const httpUrl = `${Store.config.url}/api/v4/${url}`;
  console.debug('[fetch] url: ', httpUrl);

  const response = axios.get(httpUrl, {
    headers: {
      authorization: createAuthorizationHeader(Store.getGitlabToken()),
    },
    ...config,
  });
  return response;
}

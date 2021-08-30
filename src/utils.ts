import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createAuthorizationHeader } from './auth';
import { Store } from './store';

export async function fetch<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const httpUrl = `${Store.config.url}/api/v4/${url}`;
  console.debug('[fetch] url: ', httpUrl);

  const token = (await Store.getGitlabToken()) ?? '';

  const response = axios.get(httpUrl, {
    headers: {
      authorization: createAuthorizationHeader(token),
    },
    ...config,
  });
  return response;
}

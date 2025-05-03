import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

 interface ApiRequestOptions<T> {
  method: HttpMethod;
  url: string;
  body?: T | null;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
}

 const useApi = async <T, R>(options: ApiRequestOptions<T>): Promise<R> => {
  try {
    const { method, url, body, headers = {} } = options;

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred', status: response.status }));
        throw errorData as ApiError;
    }

    const data = await response.json();
    return data as R;
  } catch (error) {
      throw error
  }
};

export const useQueryApi = <R, T = null>(
  queryKey: string[],
  options: Omit<ApiRequestOptions<T>, 'body'>,
  queryOptions?: Omit<UseQueryOptions<R, ApiError, R>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<R, ApiError, R>({
    queryKey,
    queryFn: () => useApi<T, R>(options),
    ...queryOptions,
  });
};
export const useMutationApi = <R, T = {}>(options: ApiRequestOptions<T>, mutationOptions?: Omit<UseMutationOptions<R, ApiError, T>, 'mutationFn'>) => {
  return useMutation<R, ApiError, T>({
      mutationFn: (body) => useApi<T, R>({ ...options, body }),
      ...mutationOptions,
  });
};
export {useApi};
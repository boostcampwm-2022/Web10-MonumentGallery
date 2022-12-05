import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

export type Resource<T = unknown> = {
  read: () => { error: Error | AxiosError | null; data: T | null };
};

const cache = new Map();
const CACHE_DURATION = 100;

function _axios(options: AxiosRequestConfig): Promise<AxiosResponse> {
  const optionHash = JSON.stringify(options);
  if (cache.has(optionHash)) return cache.get(optionHash);

  const fetcher = axios(options);
  cache.set(optionHash, fetcher);
  setTimeout(() => {
    cache.delete(optionHash);
  }, CACHE_DURATION);
  return fetcher;
}

export function createResource<T>(options: AxiosRequestConfig): Resource<T> {
  let data: T | null = null;
  let error: Error | AxiosError | null = null;
  const suspender = _axios(options)
    .then((res) => (data = res.data))
    .catch((e: Error | AxiosError) => {
      error = e;
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        console.log(errorData);
        if (errorData?.reason) error.message = errorData.reason;
      }
    });

  return {
    read() {
      if (data === null && !error) {
        throw suspender;
      } else if (error) {
        return { error, data };
      } else {
        return { error, data };
      }
    },
  };
}

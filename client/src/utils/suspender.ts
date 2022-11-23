import axios, { AxiosError, AxiosRequestConfig } from "axios";

export type Resource<T = unknown> = {
  read: (config: AxiosRequestConfig) => { error: Error | AxiosError | null; data: T | null };
};

export function createResource<T>(options?: AxiosRequestConfig): Resource<T> {
  let data: T | null = null;
  let error: Error | AxiosError | null = null;
  const suspender = (config: AxiosRequestConfig) =>
    axios({ ...config, ...options })
      .then((res) => (data = res.data))
      .catch((e: Error | AxiosError) => {
        error = e;
      });

  return {
    read(config: AxiosRequestConfig) {
      if (data === null && !error) {
        throw suspender(config);
      } else if (error) {
        return { error, data };
      } else {
        return { error, data };
      }
    },
  };
}

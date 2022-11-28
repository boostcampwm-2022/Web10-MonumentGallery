import axios, { AxiosError, AxiosRequestConfig } from "axios";

export type Resource<T = unknown> = {
  read: () => { error: Error | AxiosError | null; data: T | null };
};

export function createResource<T>(options: AxiosRequestConfig): Resource<T> {
  let data: T | null = null;
  let error: Error | AxiosError | null = null;
  const suspender = axios(options)
    .then((res) => (data = res.data))
    .catch((e: Error | AxiosError) => {
      error = e;
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

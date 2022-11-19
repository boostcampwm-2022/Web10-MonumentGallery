import axios, { AxiosRequestConfig } from "axios";

export type Resource<T = unknown> = { read: (config: AxiosRequestConfig) => T };

export function createResource<T>(options?: AxiosRequestConfig): Resource<T> {
  let data: T | null = null;
  const suspender = (config: AxiosRequestConfig) => axios({ ...config, ...options }).then((res) => (data = res.data));

  return {
    read(config: AxiosRequestConfig) {
      if (data === null) {
        throw suspender(config);
      } else {
        return data;
      }
    },
  };
}

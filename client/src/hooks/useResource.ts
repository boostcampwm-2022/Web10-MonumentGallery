import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { Resource } from "../utils/suspender";

export default function useResource<T>(
  resource: Resource<T>,
  options: AxiosRequestConfig,
  callback: (res: T) => void = () => null,
) {
  const data = useMemo(() => {
    const res = resource.read(options);
    callback(res);
    return res;
  }, []);

  return data;
}

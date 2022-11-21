import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { Resource } from "../utils/suspender";

export default function useResource(
  resource: Resource,
  options: AxiosRequestConfig,
  callback: (res: unknown) => void = () => null,
) {
  const data = useMemo(() => {
    const res = resource.read(options);
    callback(res);
    return res;
  }, []);

  return data;
}

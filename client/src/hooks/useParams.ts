import { useMemo } from "react";

// .../base/param1/param2 의 요청이 들어오면 [param1,param2]와 같이 반환

export function useParams(base = "", deps: React.DependencyList) {
  return useMemo(() => {
    const params = location.pathname.split("/");
    const baseIdx = params.findIndex((param) => param === base);
    return params.map((param) => (param === "" ? undefined : param)).slice(baseIdx + 1);
  }, deps);
}

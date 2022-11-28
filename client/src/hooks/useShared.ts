import { useEffect } from "react";
import userStore from "../store/user.store";
import { createResource } from "../utils/suspender";

export interface IShared {
  isShared: boolean;
}
const resource = createResource<IShared>({ method: "get", url: "/test/testShared" });

export default function CheckShared() {
  const { setShared } = userStore();
  const res = resource.read();
  if (!res.data || res.error) return null;
  const { isShared } = res.data;
  useEffect(() => {
    if (isShared) {
      setShared(true);
    }
  }, []);
  return null;
}

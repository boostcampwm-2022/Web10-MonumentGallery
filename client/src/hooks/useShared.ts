import { useEffect } from "react";
import galleryStore from "../store/gallery.store";
import { createResource } from "../utils/suspender";
import useResource from "./useResource";

export interface IShared {
  isShared: boolean;
}
const resource = createResource<IShared>();

export default function CheckShared() {
  const { setShared } = galleryStore();
  const res = useResource(resource, { method: "get", url: "/test/testShared" });
  if (!res.data || res.error) return null;
  const { isShared } = res.data;
  useEffect(() => {
    if (isShared) {
      setShared(true);
    }
  }, []);
  return null;
}

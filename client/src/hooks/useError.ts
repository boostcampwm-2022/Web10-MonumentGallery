import { useEffect } from "react";
import { GalleryLoadErrorEvent } from "../@types/gallery";

export default function useError(callback: (reason: string) => void) {
  useEffect(() => {
    function errorHandler(e: GalleryLoadErrorEvent) {
      if (!e.detail?.response) return;
      const { reason } = e.detail.response.data;
      callback(reason);
    }
    document.addEventListener("error-reason", errorHandler);
    return () => document.removeEventListener("error-reason", errorHandler);
  }, []);
}

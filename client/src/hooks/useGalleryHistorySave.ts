import galleryStore from "../store/gallery.store";
import { IGalleryMapData } from "../@types/gallery";
import audioStore from "../store/audio.store";

export function useGalleryHistorySave() {
  const { setData } = galleryStore();
  const { setSourceUrl } = audioStore();

  function applyGallery(data: IGalleryMapData, userId: string, url: string | null = null) {
    setData(data, userId);
    setSourceUrl(data.theme);
    console.log("applied", { data, userId });
    if (url !== null) window.history.pushState({ data, userId }, "", url);
  }
  function initializeGallery(data: IGalleryMapData, userId: string) {
    setData(data, userId);
    setSourceUrl(data.theme);
    console.log("initialized", { data, userId });
    window.history.replaceState({ data, userId }, "");
  }
  return {
    applyGallery,
    initializeGallery,
  };
}

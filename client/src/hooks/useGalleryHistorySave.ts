import galleryStore from "../store/gallery.store";
import { IGalleryMapData } from "../@types/gallery";
import audioStore from "../store/audio.store";

export function useGalleryHistorySave() {
  const setData = galleryStore((store) => store.setData);
  const setSourceUrl = audioStore((store) => store.setSourceUrl);

  function applyGallery(data: IGalleryMapData, userId: string, url: string | null = null) {
    setData(data, userId);
    setSourceUrl(data.theme);
    if (url !== null) window.history.pushState({ data, userId }, "", url);
  }
  function initializeGallery(data: IGalleryMapData, userId: string) {
    setData(data, userId);
    setSourceUrl(data.theme);
    window.history.replaceState({ data, userId }, "");
  }
  return { applyGallery, initializeGallery };
}

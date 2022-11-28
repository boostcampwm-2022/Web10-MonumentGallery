import create from "zustand";
import { IGalleryMapData, THEME } from "../@types/gallery";

interface GalleryStore {
  data: IGalleryMapData;
  isShared: boolean;
  setData: (data: IGalleryMapData) => void;
  setShared: (shared: boolean) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {
    uuid: "",
    nodes: [[]],
    pages: [],
    totalKeywords: {},
    theme: THEME.DREAM,
  },
  isShared: false,
  setData: (data) => set((state) => ({ ...state, data })),
  setShared: (shared) => set((state) => ({ ...state, isShared: shared })),
}));

export default galleryStore;

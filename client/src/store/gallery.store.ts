import create from "zustand";
import { IGalleryMapData, THEME } from "../@types/gallery";

interface GalleryStore {
  data: IGalleryMapData;
  userId: string | null;
  setData: (gallery: IGalleryMapData, userId: string) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {
    uuid: "",
    nodes: [[]],
    pages: [],
    totalKeywords: {},
    theme: THEME.DREAM,
  },
  userId: null,
  setData: (data, id) => set((state) => ({ ...state, data, userId: id })),
}));

export default galleryStore;

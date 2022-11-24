import create from "zustand";
import { IGalleryMapData, THEME } from "../@types/gallery";

interface GalleryStore {
  data: IGalleryMapData;
  setData: (data: IGalleryMapData) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {
    uuid: "",
    nodes: [[]],
    pages: [],
    totalKeywords: {},
    theme: THEME.DREAM,
  },
  setData: (data) => set(() => ({ data })),
}));

export default galleryStore;

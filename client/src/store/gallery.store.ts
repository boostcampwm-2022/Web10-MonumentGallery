import create from "zustand";
import { IGallaryMapData } from "../@types/gallery";

interface GalleryStore {
  data: IGallaryMapData;
  setData: (data: IGallaryMapData) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {
    uuid: "",
    nodes: [[]],
    pages: [],
    totalKeywords: {},
  },
  setData: (data) => set(() => ({ data })),
}));

export default galleryStore;

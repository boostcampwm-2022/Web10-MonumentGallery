import create from "zustand";
import { IGalleryMapData, THEME } from "../@types/gallery";

interface GalleryStore {
  data: IGalleryMapData;
  userId: string | null;
  theme: THEME | null;
  setData: (gallery: IGalleryMapData, userId: string) => void;
  setTheme: (theme: THEME) => void;
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
  theme: THEME.DREAM,
  setData: (data, userId) => set({data, userId, theme: data.theme}),
  setTheme: (theme) => set({theme}),
}));

export default galleryStore;

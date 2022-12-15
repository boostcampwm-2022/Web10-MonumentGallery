import create from "zustand";
import { gallerySelector } from "./selectors";
import { THEME } from "../constants/theme";
import type { IGalleryDataResponse, IGalleryMapData, ThemeType } from "../@types/gallery";

interface GalleryStore {
  data: IGalleryMapData;
  userId: string | null;
  theme: ThemeType | null;
  getData: (url: string) => IGalleryDataResponse;
  setData: (gallery: IGalleryMapData, userId: string) => void;
  setTheme: (theme: ThemeType) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {
    nodes: [[]],
    pages: [],
    userName: "",
    totalKeywords: {},
    groupKeywords: [],
    theme: THEME.DREAM,
    modifiedDate: Date.now(),
  },
  userId: null,
  theme: THEME.DREAM,
  getData: (url) => gallerySelector(url).data,
  setData: (data, userId) => set({ data: { ...data, modifiedDate: Date.now() }, userId, theme: data.theme }),
  setTheme: (theme) => set({ theme }),
}));

export default galleryStore;

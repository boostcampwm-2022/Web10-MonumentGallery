import create from "zustand";

interface GalleryStore {
  data: any;
  setData: (data: any) => void;
}

const galleryStore = create<GalleryStore>((set) => ({
  data: {},
  setData: (data) => set(() => ({ data })),
}));

export default galleryStore;

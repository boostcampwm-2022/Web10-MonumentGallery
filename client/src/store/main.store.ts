// import create from "zustand";
import create from "zustand";
import createVanilla from "zustand/vanilla";
import { IMainDataResponse, IPreviewGalleryData } from "../@types/main";
import { mainSelector } from "./selectors";

interface IMainMonumentData {
  gallery: IPreviewGalleryData[];
  positions: [number, number][];
}
interface MainStore {
  showSplash: boolean;
  grid: { [key: string]: IMainMonumentData };
  search: string;
  getData: (positionKey: string, searchState: string) => IMainDataResponse;
  setShowSplash: (show: boolean) => void;
  setGrid: (gallery: IPreviewGalleryData[], positionKey: string, positions: [number, number][]) => void;
  setSearch: (searchState: string) => void;
}

export const mainVanillaStore = createVanilla<MainStore>((set) => ({
  showSplash: true,
  grid: {},
  search: "",
  getData: (positionKey, searchState) => mainSelector(positionKey, searchState).data,
  setShowSplash: (show) => set({ showSplash: show }),
  setGrid: (gallery, positionKey, positions) =>
    set((state) => {
      const newGrid = { ...state.grid };
      newGrid[positionKey] = { gallery, positions };
      return { ...state, grid: newGrid };
    }),
  setSearch: (search) => set({ search }),
}));

const mainStore = create(mainVanillaStore);

export default mainStore;

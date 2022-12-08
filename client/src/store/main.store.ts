// import create from "zustand";
import create from "zustand";
import createVanilla from "zustand/vanilla";
import { IMainDataResponse } from "../@types/main";
import { mainSelector } from "./selectors";

interface IMainMonumentData {
  data: IMainDataResponse;
  positions: [number, number][];
}
interface MainStore {
  showSplash: boolean;
  grid: { [key: string]: IMainMonumentData };
  getData: (positionKey: string) => IMainDataResponse;
  setShowSplash: (show: boolean) => void;
  setGrid: (data: IMainDataResponse, positionKey: string, positions: [number, number][]) => void;
}

export const mainVanillaStore = createVanilla<MainStore>((set) => ({
  showSplash: true,
  grid: {},
  getData: (positionKey) => mainSelector(positionKey).data,
  setShowSplash: (show) => set({ showSplash: show }),
  setGrid: (data, positionKey, positions) =>
    set((state) => {
      const newGrid = { ...state.grid };
      newGrid[positionKey] = { data, positions };
      return { ...state, grid: newGrid };
    }),
}));

const mainStore = create(mainVanillaStore);

export default mainStore;

import create from "zustand";
import { IMainDataResponse } from "../@types/main";
import { mainSelector } from "./selectors";

interface IMainMonumentData {
  data: IMainDataResponse;
  positions: [number, number][];
}
interface MainStore {
  grid: { [key: string]: IMainMonumentData };
  getData: (positionKey: string) => IMainDataResponse;
  setGrid: (data: IMainDataResponse, positionKey: string, positions: [number, number][]) => void;
}

const mainStore = create<MainStore>((set) => ({
  grid: {
    "[-1,-1]": {
      data: [],
      positions: [],
    },
  },
  getData: (positionKey) => mainSelector(positionKey).data,
  setGrid: (data, positionKey, positions) =>
    set((state) => {
      const newGrid = { ...state.grid };
      newGrid[positionKey] = { data, positions };
      return { ...state, grid: newGrid };
    }),
}));
export default mainStore;

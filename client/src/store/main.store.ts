import { GridHelper } from "three";
import create from "zustand";
import { IMainDataResponse } from "../@types/main";
import { mainSelector } from "./selectors";

interface MainStore {
  grid: { [key: string]: IMainDataResponse };
  getData: () => IMainDataResponse;
  setData: (data: IMainDataResponse, position: string) => void;
}

const mainStore = create<MainStore>((set) => ({
  grid: {},
  getData: () => mainSelector().data,
  setData: (data, position) =>
    set((state) => {
      const newGrid = { ...state.grid };
      newGrid[position] = data;
      return { ...state, grid: newGrid };
    }),
}));
export default mainStore;

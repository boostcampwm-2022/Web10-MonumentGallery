import create from "zustand";
import { IToast } from "../@types/common";

interface ToastStore {
  toastList: IToast[];
  addToast: (toast: IToast) => void;
}

const toastStore = create<ToastStore>((set) => ({
  toastList: [],
  addToast: (toast: IToast) =>
    set((state) => ({
      toastList: [...state.toastList, toast],
    })),
}));

export default toastStore;

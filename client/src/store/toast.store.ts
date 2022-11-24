import create from "zustand";
import { IToast } from "../@types/common";

interface ToastStore {
  toastList: IToast[];
  addToast: (toast: IToast) => void;
  removeToast: (toast: IToast) => void;
  removeAllToast: () => void;
}

const toastStore = create<ToastStore>((set) => ({
  toastList: [],
  addToast: (toast: IToast) =>
    set((state) => ({
      toastList: [...state.toastList, toast],
    })),
  removeToast: (toast: IToast) =>
    set((state) => {
      const index = state.toastList.findIndex((e) => e === toast);
      const newToastList = [...state.toastList];
      newToastList.splice(index, 1);
      return {
        toastList: newToastList,
      };
    }),
  removeAllToast: () => set(() => ({ toastList: [] })),
}));

export default toastStore;

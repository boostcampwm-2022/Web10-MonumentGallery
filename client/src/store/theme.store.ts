import create from "zustand";
import { THEME } from "../@types/gallery";

interface ThemeStore {
  theme: THEME | null;
  setTheme: (theme: THEME | null) => void;
}

const themeStore = create<ThemeStore>((set) => ({
  theme: THEME.DREAM,
  setTheme: (theme) => set(() => ({ theme: theme })),
}));

export default themeStore;

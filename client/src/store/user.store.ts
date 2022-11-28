import create from "zustand";
import { User } from "../@types/common";

interface UserStore {
  isLoggedIn: boolean;
  isShared: boolean;
  user: User;
  setUser: (user: User) => void;
  setShared: (shared: boolean) => void;
  clearUser: () => void;
}

const userStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  isShared: false,
  user: {},
  setUser: (user) => set((state) => ({ ...state, isLoggedIn: true, user })),
  setShared: (shared) => set((state) => ({ ...state, isShared: shared })),
  clearUser: () => set(() => ({})),
}));

export default userStore;

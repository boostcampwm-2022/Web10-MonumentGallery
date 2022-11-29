import create from "zustand";
import { User } from "../@types/common";

interface UserStore {
  isLoggedIn: boolean;
  isShared: boolean;
  isCreated: boolean;
  user: User;
  setUser: (user: User) => void;
  setShared: (shared: boolean) => void;
  setCreated: (created: boolean) => void;
  clearUser: () => void;
}

const userStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  isShared: false,
  isCreated: false,
  user: {},
  setUser: (user) => set((state) => ({ isLoggedIn: true, user })),
  setShared: (shared) => set((state) => ({ isShared: shared })),
  setCreated: (created) => set((state) => ({ isCreated: created })),
  clearUser: () => set(() => ({ isLoggedIn: false, isShared: false, isCreated: false, user: {} })),
}));

export default userStore;

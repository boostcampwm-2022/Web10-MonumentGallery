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
  setUser: (user) => set(() => ({ isLoggedIn: true, user })),
  setShared: (shared) => set(() => ({ isShared: shared })),
  setCreated: (created) => set(() => ({ isCreated: created })),
  clearUser: () => set(() => ({ isLoggedIn: false, isShared: false, isCreated: false, user: {} })),
}));

export default userStore;

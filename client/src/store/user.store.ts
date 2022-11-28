import create from "zustand";
import { User } from "../@types/common";

interface UserStore {
  isLoggedIn: boolean;
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const userStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  user: {},
  setUser: (user) => set(() => ({ isLoggedIn: true, user })),
  clearUser: () => set(() => ({})),
}));

export default userStore;

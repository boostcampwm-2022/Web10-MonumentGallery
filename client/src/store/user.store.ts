import create from "zustand";
import { User } from "../@types/common";
import { ICheck } from "../hooks/useLoggedIn";
import { loginSelector } from "./selectors";

interface UserStore {
  isLoggedIn: boolean;
  isShared: boolean;
  isCreated: boolean;
  user: User;
  getUser: () => ICheck;
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
  getUser: () => loginSelector().data,
  setUser: (user) => set(() => ({ isLoggedIn: true, user })),
  setShared: (shared) => set(() => ({ isShared: shared })),
  setCreated: (created) => set(() => ({ isCreated: created })),
  clearUser: () => set(() => ({ isLoggedIn: false, isShared: false, isCreated: false, user: {} })),
}));

export default userStore;

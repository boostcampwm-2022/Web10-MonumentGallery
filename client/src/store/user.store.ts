import create from "zustand";

interface UserStore {
  isLoggedIn: boolean;
  userId: string | null;
  setUser: (userId: string) => void;
  clearUser: () => void;
}

const userStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  userId: null,
  setUser: (userId) => set(() => ({ isLoggedIn: true, userId })),
  clearUser: () => set(() => ({ isLoggedIn: false, userId: null })),
}));

export default userStore;

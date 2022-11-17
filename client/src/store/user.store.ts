import create from "zustand";

interface UserStore {
  isLoggedIn: boolean;
  userId: string | null;
  setUser: (userId: string) => void;
}

const userStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  userId: null,
  setUser: (userId) => {
    set(() => ({ isLoggedIn: true }));
    set(() => ({ userId }));
  },
}));

export default userStore;

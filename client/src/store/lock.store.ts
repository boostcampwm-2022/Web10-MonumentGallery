import create from "zustand";

interface LockStore {
  locked: boolean;
  setLocked: (lock: boolean) => void;
}

const lockStore = create<LockStore>((set) => ({
  locked: false,
  setLocked: (lock) => {
    set(() => ({ locked: lock }));
  },
}));

export default lockStore;

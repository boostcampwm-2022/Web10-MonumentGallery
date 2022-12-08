import create from "zustand";

interface SettingStore {
  showDevtool: boolean;
  speed: number;
  setShowDevtool: (showDevtool: boolean) => void;
  setSpeed: (speed: number) => void;
}

const settingStore = create<SettingStore>((set) => ({
  showDevtool: false,
  speed: 10,
  setShowDevtool: (showDevtool) => set({ showDevtool }),
  setSpeed: (speed) => set({ speed }),
}));

export default settingStore;

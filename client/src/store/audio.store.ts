import create from "zustand";

interface AudioStore {
  sourceUrl: string;
  isPlaying: boolean;
  volume: number;
  setSourceUrl: (sourceUrl: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
}

const audioStore = create<AudioStore>((set) => ({
  sourceUrl: "https://kr.object.ncloudstorage.com/monument-gallery/Vlad%20Gluschenko%20-%20Meaning.wav",
  isPlaying: false,
  volume: 50,
  setSourceUrl: (sourceUrl) => set({ sourceUrl }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));

export default audioStore;

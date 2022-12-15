import create from "zustand";
import type { THEME } from "../constants/theme";

const AudioTrackUrl = {
  DREAM: "https://kr.object.ncloudstorage.com/monument-gallery/audio/dream.mp3",
  SPRING: "https://kr.object.ncloudstorage.com/monument-gallery/audio/spring.wav",
  SUMMER: "https://kr.object.ncloudstorage.com/monument-gallery/audio/summer.wav",
  AUTUMN: "https://kr.object.ncloudstorage.com/monument-gallery/audio/autumn.wav",
  WINTER: "https://kr.object.ncloudstorage.com/monument-gallery/audio/winter.wav",
};

interface AudioStore {
  sourceUrl: string;
  isPlaying: boolean;
  volume: number;
  setSourceUrl: (theme: THEME) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
}

const audioStore = create<AudioStore>((set) => ({
  sourceUrl: AudioTrackUrl.DREAM,
  isPlaying: false,
  volume: 50,
  setSourceUrl: (theme) => set({ sourceUrl: AudioTrackUrl[theme] }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));

export default audioStore;

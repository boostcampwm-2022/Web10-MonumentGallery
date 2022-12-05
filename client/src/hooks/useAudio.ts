import { useEffect, useMemo } from "react";
import audioStore from "../store/audio.store";

export default function useAudio() {
  const { sourceUrl, isPlaying, volume } = audioStore();
  const audio = useMemo(() => new Audio(sourceUrl), [sourceUrl]);

  useEffect(() => {
    if (isPlaying) {
      audio.play();
      audio.volume = volume / 500;
      return;
    }
    audio.pause();
  }, [isPlaying, volume]);
}

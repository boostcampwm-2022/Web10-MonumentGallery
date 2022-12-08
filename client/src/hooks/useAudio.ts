import { useEffect, useLayoutEffect } from "react";
import audioStore from "../store/audio.store";

export default function useAudio(audioRef: React.RefObject<HTMLAudioElement>) {
  const { sourceUrl, isPlaying, volume } = audioStore();

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
      return;
    }
    audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 500;
  }, [volume]);

  useLayoutEffect(() => {
    if (!audioRef.current) return;
    if (sourceUrl === audioRef.current.src) return;
    audioRef.current.remove();
    audioRef.current.src = sourceUrl;
    if (isPlaying) audioRef.current.play();
  }, [sourceUrl]);
}

import { useRef, useState, useEffect } from "react";
import useAudio from "../../hooks/useAudio";
import audioStore from "../../store/audio.store";

import PlayIcon from "../../assets/images/play.png";
import PauseIcon from "../../assets/images/pause.png";

export default function AudioHandler() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, setIsPlaying, volume, setVolume } = audioStore();
  const [autoplay, setAutoplay] = useState(false);
  useAudio(audioRef);

  useEffect(() => {
    function onAutoplayInteraction() {
      if (!autoplay) {
        setIsPlaying(true);
        setAutoplay(true);
      }
    }
    document.addEventListener("keydown", onAutoplayInteraction);
    return () => document.removeEventListener("keydown", onAutoplayInteraction);
  }, [autoplay]);

  return (
    <>
      <audio ref={audioRef} />
      <button
        className="footer-element"
        onClick={(e) => {
          setIsPlaying(!isPlaying);
          e.currentTarget.blur();
        }}
      >
        <img width={24} height={24} src={isPlaying ? PauseIcon : PlayIcon} />
      </button>
      <input
        className="footer-volume"
        style={{
          background: `linear-gradient(to right, #9e9e9e 0%, #9e9e9e ${volume}%, #ececec ${volume}%, #ececec 100%)`,
        }}
        type="range"
        value={volume}
        onChange={(e) => setVolume(+e.target.value)}
      />
    </>
  );
}

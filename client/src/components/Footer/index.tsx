import "./style.scss";
import GithubMark from "../../assets/images/GitHub-Mark-Light-32px.png";
import ExpandIcon from "../../assets/images/expand.png";
import ScreenShotIcon from "../../assets/images/viewfinder.png";
import PlayIcon from "../../assets/images/play.png";
import PauseIcon from "../../assets/images/pause.png";
import galleryStore from "../../store/gallery.store";
import { useEffect, useRef, useState } from "react";
import useAudio from "../../hooks/useAudio";
import audioStore from "../../store/audio.store";

export default function Footer() {
  const { theme } = galleryStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, setIsPlaying, volume, setVolume } = audioStore();
  const [autoplay, setAutoplay] = useState(false);
  useAudio(audioRef);

  useEffect(() => {
    console.log({ theme, isPlaying });
  }, [theme, isPlaying]);

  useEffect(() => {
    function onFkeyDown(e: KeyboardEvent) {
      if (!autoplay) {
        setIsPlaying(true);
        setAutoplay(true);
      }
      if (e.code !== "KeyF") {
        return;
      }
      onFullScreen();
    }
    document.addEventListener("keydown", onFkeyDown);
    return () => document.removeEventListener("keydown", onFkeyDown);
  }, [autoplay]);

  function onFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      return;
    }
    document.exitFullscreen();
  }

  return (
    <div className="footer">
      <audio ref={audioRef} />
      <span className="footer-text">© Monument Gallery</span>
      <a href="https://github.com/boostcampwm-2022/Web10-MonumentGallery" target="_blank" rel="noreferrer">
        <button className="footer-element">
          <img height={24} src={GithubMark} />
        </button>
      </a>
      <button
        className="footer-element"
        onClick={(e) => {
          setIsPlaying(!isPlaying);
          e.currentTarget.blur();
        }}
      >
        {isPlaying ? <img height={24} src={PauseIcon} /> : <img height={24} src={PlayIcon} />}
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
      <button
        className="footer-element"
        onClick={(e) => {
          document.dispatchEvent(new CustomEvent("save-screenshot"));
          e.currentTarget.blur();
        }}
      >
        <img height={24} src={ScreenShotIcon} />
      </button>
      <button className="footer-element" onClick={onFullScreen}>
        <img height={24} src={ExpandIcon} />
      </button>
    </div>
  );
}

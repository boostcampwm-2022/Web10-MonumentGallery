import "./style.scss";
import GithubMark from "../../assets/images/GitHub-Mark-Light-32px.png";
import ExpandIcon from "../../assets/images/expand.png";
import ScreenShotIcon from "../../assets/images/viewfinder.png";
import PlayIcon from "../../assets/images/play.png";
import PauseIcon from "../../assets/images/pause.png";
import galleryStore from "../../store/gallery.store";
import { useEffect } from "react";
import useAudio from "../../hooks/useAudio";
import audioStore from "../../store/audio.store";

export default function Footer() {
  const { theme } = galleryStore();
  const { isPlaying, setIsPlaying, volume, setVolume } = audioStore();
  useAudio();

  useEffect(() => {
    console.log({ theme, isPlaying });
  }, [theme, isPlaying]);

  return (
    <div className="footer">
      <span className="footer-text">© Monument Gallery</span>
      <a href="https://github.com/boostcampwm-2022/Web10-MonumentGallery" target="_blank" rel="noreferrer">
        <button className="footer-element">
          <img height={24} src={GithubMark} />
        </button>
      </a>
      <button className="footer-element" onClick={() => setIsPlaying(!isPlaying)}>
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
      <button className="footer-element">
        <img height={24} src={ScreenShotIcon} />
      </button>
      <button className="footer-element">
        <img height={24} src={ExpandIcon} />
      </button>
    </div>
  );
}

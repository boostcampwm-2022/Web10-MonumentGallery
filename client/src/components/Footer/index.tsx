import AudioHandler from "./AudioHandler";
import ExpandButton from "./ExpandButton";

import "./style.scss";
import GithubMark from "../../assets/images/github.svg";
import ScreenshotButton from "./ScreenshotButton";

export default function Footer() {
  return (
    <div className="footer">
      <span className="footer-text">© Monument Gallery</span>
      <a href="https://github.com/boostcampwm-2022/Web10-MonumentGallery" target="_blank" rel="noreferrer">
        <button type="button" className="footer-element">
          <img width={24} height={24} src={GithubMark} alt="github" />
        </button>
      </a>
      <AudioHandler />
      <ScreenshotButton />
      <ExpandButton />
    </div>
  );
}

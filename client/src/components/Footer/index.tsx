import AudioHandler from "./AudioHandler";
import ExpandButton from "./ExpandButton";

import "./style.scss";
import GithubMark from "../../assets/images/GitHub-Mark-Light-32px.png";
import ScreenShotIcon from "../../assets/images/viewfinder.png";

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
      <button
        type="button"
        className="footer-element"
        onClick={(e) => {
          document.dispatchEvent(new CustomEvent("save-screenshot"));
          e.currentTarget.blur();
        }}
      >
        <img width={24} height={24} src={ScreenShotIcon} alt="screenshot" />
      </button>
      <ExpandButton />
    </div>
  );
}

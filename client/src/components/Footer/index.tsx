import AudioHandler from "./AudioHandler";
import ExpandButton from "./ExpandButton";
import Helper from "./Helper";

import "./style.scss";
import GithubMark from "../../assets/images/github.svg";
import ScreenshotButton from "./ScreenshotButton";

import type { ReactNode } from "react";

interface FooterProps {
  helper: ReactNode;
}

export default function Footer({ helper }: FooterProps) {
  return (
    <div className="footer">
      <span className="footer-text">© Monument Gallery</span>
      <a href="https://github.com/boostcampwm-2022/Web10-MonumentGallery" target="_blank" rel="noreferrer">
        <button type="button" className="footer-element">
          <img width={24} height={24} src={GithubMark} alt="github" />
        </button>
      </a>
      {helper && <Helper>{helper}</Helper>}
      <AudioHandler />
      <ScreenshotButton />
      <ExpandButton />
    </div>
  );
}

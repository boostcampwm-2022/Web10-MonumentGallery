import React from "react";
import GalleryInfo from "./galleryInfo";
import "./style.scss";
import headerLogo from "../../assets/images/header-logo.svg";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="header">
      <div className="header-info">
        <a className="logo" href="/">
          <img className="logo-ico" src={headerLogo} width="40" height="40" alt="monument gallery logo"></img>
          <span className="logo-title">Monument Gallery</span>
        </a>
        <GalleryInfo />
      </div>
      <div className="header-right-elem">{children}</div>
    </div>
  );
}

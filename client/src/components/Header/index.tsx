import React from "react";
import GalleryInfo from "./galleryInfo";
import "./style.scss";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="header">
      <div className="header-info">
        <a href="/">
          <span className="logo">MonumentGallery</span>
        </a>
        <GalleryInfo />
      </div>
      <div className="header-right-elem">{children}</div>
    </div>
  );
}

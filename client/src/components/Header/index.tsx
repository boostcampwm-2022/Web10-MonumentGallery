import React from "react";
import "./style.scss";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="header">
      <a href="/">
        <span className="logo">MonumentGallery</span>
      </a>
      <div className="header-right-elem">
        <>
          <div></div>
          {children}
        </>
      </div>
    </div>
  );
}

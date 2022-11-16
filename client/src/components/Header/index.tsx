import React from "react";
import Menu from "../../assets/images/hamburger.svg";
import "./style.scss";

export default function Header() {
  return (
    <div className="header">
      <a href="/">
        <span className="logo">MonumentGallery</span>
      </a>
      <button>
        <img width={24} height={24} src={Menu} />
      </button>
    </div>
  );
}

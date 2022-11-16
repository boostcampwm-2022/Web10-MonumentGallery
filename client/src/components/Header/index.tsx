import React from "react";
import Menu from "../../../public/images/hamburger.svg";
import "./style.scss";

export default function Header() {
  return (
    <div className="header">
      <button>
        <span className="logo">MonumentGallery</span>
      </button>
      <button>
        <img width={24} height={24} src={Menu} />
      </button>
    </div>
  );
}

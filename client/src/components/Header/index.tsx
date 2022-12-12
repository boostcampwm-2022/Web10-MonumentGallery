import React from "react";
import "./style.scss";
import headerLogo from "../../assets/images/headerLogo.svg";
export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="header">
      <a href="/">
        <img className="logo" src={headerLogo}></img>
      </a>
      <div className="header-right-elem">{children}</div>
    </div>
  );
}

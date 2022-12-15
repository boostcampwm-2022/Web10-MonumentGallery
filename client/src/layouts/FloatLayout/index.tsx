import React from "react";
import "./style.scss";

export default function FloatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="float-box">
      <div className="float-relative">{children}</div>
    </div>
  );
}

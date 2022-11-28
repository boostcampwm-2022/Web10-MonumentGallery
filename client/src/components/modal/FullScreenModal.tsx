import React from "react";
import "./style.scss";

interface FullScreenModalProps {
  children: React.ReactNode;
  show: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  css: React.CSSProperties;
}

export default function FullScreenModal({ children, show, setShow, css }: FullScreenModalProps) {
  return (
    <div hidden={!show}>
      <div
        className="dimmed"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (setShow) setShow(false);
        }}
      />
      <div className="fullscreen-modal" style={css}>
        {children}
      </div>
    </div>
  );
}

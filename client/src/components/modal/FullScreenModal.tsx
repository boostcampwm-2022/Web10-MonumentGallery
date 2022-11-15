import React from "react";
import "./style.scss";

interface FullScreenModalProps {
  children: React.ReactNode;
  width: string;
  height: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FullScreenModal({ children, width, height, show, setShow }: FullScreenModalProps) {
  return (
    <div hidden={!show}>
      <div
        className="dimmed"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(false);
        }}
      />
      <div className="fullscreen-modal" style={{ width, height }}>
        {children}
      </div>
    </div>
  );
}

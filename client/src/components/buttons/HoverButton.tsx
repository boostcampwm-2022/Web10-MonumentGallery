import "./HoverButton.scss";
import type { MouseEvent } from "react";
import React from "react";

interface HoverButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  img: string;
  caption: string;
  className?: string;
  children?: React.ReactNode;
}

export default function HoverButton({ onClick, img, caption, className, children }: HoverButtonProps) {
  return (
    <div>
      <button className={`hover-button${className ? " " + className : ""}`} onClick={onClick ?? undefined}>
        <img width={30} height={30} src={img} alt={caption}></img>
        <div className="hover-caption">{caption}</div>
      </button>
      {children}
    </div>
  );
}

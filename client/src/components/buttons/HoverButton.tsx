import "./HoverButton.scss";
import type { MouseEvent } from "react";

interface HoverButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  img: string;
  caption: string;
  className?: string;
}

export default function HoverButton({ onClick, img, caption, className }: HoverButtonProps) {
  return (
    <button className={`hover-button${className ? " " + className : ""}`} onClick={onClick ?? undefined}>
      <img width={30} height={30} src={img} alt={caption}></img>
      <div className="hover-caption">{caption}</div>
    </button>
  );
}

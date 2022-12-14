import { useEffect } from "react";

import ExpandIcon from "../../assets/images/fullscreen.svg";

export default function ExpandButton() {
  function onFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      return;
    }
    document.exitFullscreen();
  }

  useEffect(() => {
    function onFkeyDown(e: KeyboardEvent) {
      if (e.code !== "KeyF") return;
      onFullScreen();
    }
    document.addEventListener("keydown", onFkeyDown);
    return () => document.removeEventListener("keydown", onFkeyDown);
  }, []);

  return (
    <button type="button" className="footer-element" onClick={onFullScreen}>
      <img width={24} height={24} src={ExpandIcon} alt="expand" />
    </button>
  );
}

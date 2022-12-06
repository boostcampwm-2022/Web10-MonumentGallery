import { useEffect } from "react";

import ExpandIcon from "../../assets/images/expand.png";

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
    <button className="footer-element" onClick={onFullScreen}>
      <img height={24} src={ExpandIcon} />
    </button>
  );
}

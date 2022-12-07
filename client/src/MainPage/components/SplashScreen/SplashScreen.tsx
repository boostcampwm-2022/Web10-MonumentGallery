import "./SplashScreen.scss";
import SplashScreenLogo from "../../../assets/images/splashScreenLogo.png";
import { useState } from "react";
export default function SplashScreen() {
  const [show, setShow] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<string>("");
  return (
    <div className={`splash-screen ${fadeOut}`} style={{ visibility: show ? "inherit" : "hidden" }}>
      <img src={SplashScreenLogo}></img>
      <button
        onClick={() => {
          setFadeOut("fadeout");
          setTimeout(() => {
            setShow(false);
          }, 2000);
        }}
      >
        입장하기
      </button>
    </div>
  );
}

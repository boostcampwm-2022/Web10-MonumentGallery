import { Suspense, useState } from "react";
import Spinner from "../../../components/Spinner";

import "./SplashScreen.scss";
import SplashScreenLogo from "../../../assets/images/splash-logo-1x.webp";
import SplashScreenLogo2x from "../../../assets/images/splash-logo-2x.webp";
import { splashSelector } from "../../../store/selectors";
import mainStore from "../../../store/main.store";

export default function Splash() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <SelectSplash />
    </Suspense>
  );
}

function SplashScreen() {
  const [grid, show, setShow] = mainStore((store) => [store.grid, store.showSplash, store.setShowSplash]);
  const [fadeOut, setFadeOut] = useState<string>("");

  return (
    <div className={`splash-screen ${fadeOut}`} hidden={!show}>
      <img
        src={SplashScreenLogo}
        width={480}
        height={480}
        alt="splash"
        srcSet={`${SplashScreenLogo} 1x, ${SplashScreenLogo2x} 2x`}
      ></img>
      {grid["[-1,-1]"] ? (
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
      ) : (
        <button>
          <Spinner />
        </button>
      )}
    </div>
  );
}

function SelectSplash() {
  splashSelector();
  return null;
}

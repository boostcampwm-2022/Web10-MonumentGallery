import React, { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import ErrorBoundary from "../components/common/ErrorBoundary";
import Player from "./mapObjects/Player";
import MapDataFetcher from "./components/MapDataFetcher";
import Ground from "./mapObjects/Ground";
import Environments from "./mapObjects/Environments";
import DevTools from "../components/Devtools";
import useError from "../hooks/useError";
import toastStore from "../store/toast.store";
import TOAST from "../components/Toast/ToastList";
import mainStore from "../store/main.store";

export default function MainWorld() {
  const addToast = toastStore((store) => store.addToast);
  const setShowSplash = mainStore((store) => store.setShowSplash);

  useError((reason) => {
    addToast(TOAST.ERROR(reason));
    setShowSplash(false);
  });

  return (
    <Physics gravity={[0, 0, 0]}>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <MapDataFetcher />
        </Suspense>
      </ErrorBoundary>
      <Light />
      <Ground />
      <Environments />
      <Player />
      {/*<DevTools showDevtool={true} speed={10} />*/}
    </Physics>
  );
}

import React, { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import ErrorBoundary from "../components/common/ErrorBoundary";
import Player from "./mapObjects/Player";
import MapDataFetcher from "./components/MapDataFetcher";
import Ground from "./mapObjects/Ground";
import DevTools from "../components/Devtools";
import Environments from "./mapObjects/Environments";

export default function MainWorld() {
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
      {/* <DevTools speed={40} /> */}
    </Physics>
  );
}

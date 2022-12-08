import React, { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import ErrorBoundary from "../components/common/ErrorBoundary";
import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import MapDataFetcher from "./components/MapDataFetcher";
import Ground from "./mapObjects/Ground";
// import DevTools from "../components/Devtools";

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
      <Player />
      <Plane />
      {/* <DevTools speed={40} /> */}
    </Physics>
  );
}

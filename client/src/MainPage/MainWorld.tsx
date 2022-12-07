import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import MapDataFetcher from "./components/MapDataFetcher";
import Ground from "./mapObjects/Ground";
import DevTools from "../components/Devtools";

export default function MainWorld() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <Suspense fallback={null}>
        <MapDataFetcher />
      </Suspense>
      <Light />
      <Ground />
      <Player />
      <Plane />
      <DevTools />
    </Physics>
  );
}

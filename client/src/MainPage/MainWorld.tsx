import { Suspense } from "react";
import { Debug, Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import MapDataFetcher from "./components/MapDataFetcher";
import Ground from "./mapObjects/Ground";
import Zoom from "./components/Zoom";

export default function MainWorld() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <Debug />
      <Suspense fallback={null}>
        <MapDataFetcher />
      </Suspense>
      <Light />
      <Ground />
      <Player />
      <Plane />
      <Zoom />
    </Physics>
  );
}

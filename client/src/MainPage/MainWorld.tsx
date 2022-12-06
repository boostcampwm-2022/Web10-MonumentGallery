import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import MapDataFetcher from "./components/MapDataFetcher";
import { Suspense } from "react";
import { Box } from "@react-three/drei";

export default function MainWorld() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <Suspense fallback={null}>
        <MapDataFetcher />
      </Suspense>
      <Light />
      <Box position={[-25, 0, 0]} />
      <Player />
      <Plane />
    </Physics>
  );
}

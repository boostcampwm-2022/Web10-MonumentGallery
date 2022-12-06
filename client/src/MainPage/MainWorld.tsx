import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import MapDataFetcher from "./components/MapDataFetcher";
import { Suspense, useEffect, useState } from "react";
import { Box } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export default function MainWorld() {
  const { camera } = useThree();
  const [cameraScale, setCameraScale] = useState(1);

  useFrame(() => {
    camera.scale.set(cameraScale, cameraScale, cameraScale);
  });

  useEffect(() => {
    function wheelHandler(e: WheelEvent) {
      if (cameraScale < 1.5 && e.deltaY > 0) {
        setCameraScale((prev) => prev + e.deltaY / 1000);
      }
      if (cameraScale > 0.2 && e.deltaY < 0) {
        setCameraScale((prev) => prev + e.deltaY / 1000);
      }
    }
    document.addEventListener("wheel", wheelHandler);
    return () => document.removeEventListener("wheel", wheelHandler);
  }, [cameraScale]);

  return (
    <Physics gravity={[0, 0, 0]}>
      <Suspense fallback={null}>
        <MapDataFetcher />
      </Suspense>
      <Light />
      <Player />
      <Plane />
    </Physics>
  );
}

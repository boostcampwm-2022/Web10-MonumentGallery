import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

// import MainWorld from "./MainWorld";
const MainWorld = React.lazy(() => import("./MainWorld"));

import galleryStore from "../store/gallery.store";
import { BACKGROUND_COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";
import { MAIN_CAMERA_Y, MAIN_CAMERA_Z } from "../constants/positions";

export default function MainCanvas() {
  const theme = galleryStore((store) => store.theme);
  const backgroundColor = useMemo(() => (theme && BACKGROUND_COLORS[theme]) || THEME.DREAM, [theme]);

  return (
    <Canvas
      shadows
      className="canvas-inner"
      camera={{ zoom: 50, fov: 35, position: [0, MAIN_CAMERA_Y, MAIN_CAMERA_Z], rotation: [-Math.PI / 4, 0, 0, "YXZ"] }}
      orthographic
    >
      <color attach="background" args={[backgroundColor]} />
      <Suspense fallback={null}>
        <MainWorld />
      </Suspense>
    </Canvas>
  );
}

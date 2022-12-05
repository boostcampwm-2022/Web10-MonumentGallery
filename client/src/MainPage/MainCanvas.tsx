import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Stats } from "@react-three/drei";

import MainWorld from "./MainWorld";

import themeStore from "../store/theme.store";

import { BACKGROUND_COLORS } from "../@types/colors";
import { THEME } from "../@types/gallery";

export default function MainCanvas() {
  const { theme } = themeStore();
  const backgroundColor = useMemo(() => (theme && BACKGROUND_COLORS[theme]) || THEME.DREAM, [theme]);

  return (
    <Canvas
      shadows
      className="canvas-inner"
      camera={{ zoom: 50, fov: 35, position: [10, 15, 10], rotation: [-Math.PI / 4, Math.PI / 4, 0, "YXZ"] }}
      orthographic
    >
      <color attach="background" args={[backgroundColor]} />
      <MainWorld />
      <axesHelper />
      <Box position={[2, 0, 0]} />
      <Stats />
    </Canvas>
  );
}

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

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
      camera={{ fov: 75, near: 0.1, far: 100, position: [10, 15, 10], rotation: [0, Math.PI / 4, 0, "YXZ"] }}
    >
      <color attach="background" args={[backgroundColor]} />
      <MainWorld />
      <axesHelper />
      <Box position={[2, 0, 0]} />
    </Canvas>
  );
}

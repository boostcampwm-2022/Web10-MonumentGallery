import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

import MainWorld from "./MainWorld";
import ScreenshotCapturer from "../components/ScreenshotCapturer";

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
      camera={{ zoom: 50, fov: 35, position: [0, 10, 10], rotation: [-Math.PI / 4, 0, 0, "YXZ"] }}
      orthographic
    >
      <color attach="background" args={[backgroundColor]} />
      <MainWorld />
      <axesHelper />
      <gridHelper args={[10000, 200]} position={[25, 0, 25]} />
      <Stats />
      <ScreenshotCapturer />
    </Canvas>
  );
}

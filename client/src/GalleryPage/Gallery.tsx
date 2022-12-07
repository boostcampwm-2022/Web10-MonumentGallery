import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import GalleryWorld from "./GalleryWorld";
import Light from "./mapObjects/Light";
import CollisionPlayerBody from "./components/CollisionPlayerBody";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import ScreenshotCapturer from "../components/ScreenshotCapturer";

import galleryStore from "../store/gallery.store";

import { BACKGROUND_COLORS } from "../@types/colors";
import { THEME } from "../@types/gallery";

export default function Gallery() {
  const data = galleryStore((store) => store.data);
  const theme = galleryStore((store) => store.theme);
  const backgroundColor = useMemo(() => (theme && BACKGROUND_COLORS[theme]) || THEME.DREAM, [theme]);

  return (
    <Canvas
      shadows
      className="canvas-inner"
      camera={{ fov: 75, near: 0.1, far: 50, position: [0, 1.5, 5], rotation: [0.4, 0, 0] }}
      style={{ backgroundColor: (theme && BACKGROUND_COLORS[theme]) || THEME.DREAM }}
    >
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[backgroundColor, 30, 50]} />
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <CollisionPlayerBody />
        <MovementController speed={5} />
        <ViewRotateController />
        <GalleryWorld data={data} />
      </Physics>
      <ScreenshotCapturer />
      <Stats />
    </Canvas>
  );
}

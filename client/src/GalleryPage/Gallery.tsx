import { Canvas } from "@react-three/fiber";
import { IGalleryMapData } from "../@types/gallery";

import GalleryWorld from "./GalleryWorld";
import Light from "./mapObjects/Light";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import dummyData from "./dummyData";

export default function Gallery() {
  return (
    <Canvas
      shadows
      className="canvas-inner"
      camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.5, 5], rotation: [0.4, 0, 0] }}
    >
      <Light />
      <MovementController speed={5} />
      <ViewRotateController />
      <GalleryWorld data={dummyData} />
    </Canvas>
  );
}

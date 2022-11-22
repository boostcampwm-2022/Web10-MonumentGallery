import { Canvas } from "@react-three/fiber";
import { IGalleryMapData } from "../@types/gallery";

import GalleryWorld from "./GalleryWorld";
import Light from "./mapObjects/Light";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import dummyData from "./dummyData";

// const camera = new THREE.PerspectiveCamera(75, 1920 / 1080, 0.1, 100);
// camera.position.set(0, 1.5, 2);
export default function Gallery() {
  return (
    <Canvas className="canvas-inner" camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.5, 2] }}>
      <Light />
      <MovementController speed={5} />
      <ViewRotateController />
      <GalleryWorld data={dummyData as IGalleryMapData} />
    </Canvas>
  );
}

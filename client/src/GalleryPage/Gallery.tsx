import { Canvas } from "@react-three/fiber";
import GalleryWorld from "./GalleryWorld";
import Light from "./components/Light";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import dummyData from "./dummyData";
import { IGallaryMapData } from "../@types/common";

export default function Gallery() {
  return (
    <Canvas className="canvas-inner" camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.5, 2] }}>
      <Light />
      <MovementController speed={5} />
      <ViewRotateController />
      <GalleryWorld data={dummyData as IGallaryMapData} />
    </Canvas>
  );
}

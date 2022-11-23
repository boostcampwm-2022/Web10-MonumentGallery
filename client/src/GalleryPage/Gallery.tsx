import { Canvas } from "@react-three/fiber";
import { IGalleryMapData } from "../@types/gallery";
import GalleryWorld from "./GalleryWorld";
import Light from "./mapObjects/Light";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import dummyData from "./dummyData";
import { Physics } from "@react-three/rapier";
import CollisionPlayerBody from "./mapObjects/CollisionPlayerBody";

export default function Gallery() {
  return (
    <Canvas className="canvas-inner" camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.5, 2] }}>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <CollisionPlayerBody />
        <MovementController speed={5} />
        <ViewRotateController />
        <GalleryWorld data={dummyData as IGalleryMapData} />
      </Physics>
    </Canvas>
  );
}

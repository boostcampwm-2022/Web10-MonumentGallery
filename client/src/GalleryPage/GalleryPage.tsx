import "./style.scss";
import { Canvas } from "@react-three/fiber";
import Gallery from "./Gallery";
import DomElements from "./components/DomElements";
export default function GalleryPage({ user, history }: { user: string; history: string }) {
  console.log({ user, history });
  return (
    <>
      <div className="canvas-outer">
        <Canvas className="canvas-inner" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
          <Gallery />
        </Canvas>
      </div>
      <DomElements />
    </>
  );
}

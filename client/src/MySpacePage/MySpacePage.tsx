import "./style.scss";
import { Canvas } from "@react-three/fiber";
import MySpace from "./MySpace";
import DomElements from "./components/DomElements";
export default function MySpacePage() {
  return (
    <>
      <div className="canvas-outer">
        <Canvas className="canvas-inner" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
          <MySpace />
        </Canvas>
      </div>
      <DomElements />
    </>
  );
}

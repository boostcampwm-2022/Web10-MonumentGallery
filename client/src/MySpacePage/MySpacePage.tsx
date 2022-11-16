import "./style.scss";
import { Canvas } from "@react-three/fiber";
import MySpace from "./MySpace";
export default function MySpacePage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas className="canvas" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
        <MySpace />
      </Canvas>
    </div>
  );
}

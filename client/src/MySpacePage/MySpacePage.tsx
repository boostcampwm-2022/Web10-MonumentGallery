import "./style.scss";
import { Canvas } from "@react-three/fiber";
import MySpace from "./MySpace";
import UI from "./components/UI";
import { useState } from "react";
export default function MySpacePage() {
  const [locked, setLocked] = useState(false);
  return (
    <>
      {!locked && <UI />}
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas className="canvas" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
          <MySpace locked={locked} setLocked={setLocked} />
        </Canvas>
      </div>
    </>
  );
}

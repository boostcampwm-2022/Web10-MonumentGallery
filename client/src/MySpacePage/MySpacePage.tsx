import "./style.scss";
import { Canvas } from "@react-three/fiber";
import MySpace from "./MySpace";
import UI from "./components/UI";
import { useRef, useState } from "react";
import FloatLayout from "../layouts/FloatLayout";
import Header from "../components/Header";
export default function MySpacePage() {
  const locked = useRef<boolean>(false);
  const [lockedState, setLockedState] = useState(false);

  return (
    <>
      <div className="canvas-outer">
        <Canvas className="canvas-inner" camera={{ fov: 75, near: 1, far: 20, position: [0, 5, 10] }}>
          <MySpace
            locked={locked.current}
            setLocked={(lock: boolean) => {
              locked.current = lock;
              setLockedState(locked.current);
            }}
          />
        </Canvas>
      </div>
      {!lockedState && (
        <FloatLayout>
          <Header />
          <UI />
        </FloatLayout>
      )}
    </>
  );
}

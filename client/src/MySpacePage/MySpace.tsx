import React from "react";
import FPVControls from "./components/FPVControls";
import Light from "./components/Light";
import Plane from "./components/Plane";
import ORBControls from "./components/ORBControls";

interface MySpaceProps {
  locked: boolean;
  setLocked: (lock: boolean) => void;
}

export default function MySpace({ locked, setLocked }: MySpaceProps) {
  return (
    <>
      <Light />
      {locked ? <FPVControls locked={locked} setLocked={setLocked} /> : <ORBControls setLocked={setLocked} />}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

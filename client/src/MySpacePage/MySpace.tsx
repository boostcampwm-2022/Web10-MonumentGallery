import { useState } from "react";
import FPVControls from "./components/FPVControls";
import Light from "./components/Light";
import Plane from "./components/Plane";
import TPVControls from "./components/TPVControls";
export default function MySpace({
  locked,
  setLocked,
}: {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Light />
      {locked ? <FPVControls locked={locked} setLocked={setLocked} /> : <TPVControls />}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

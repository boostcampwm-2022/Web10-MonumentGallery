import { useState } from "react";
import FPVControls from "./components/FPVControls";
import Light from "./components/Light";
import Plane from "./components/Plane";
import TPVControls from "./components/TPVControls";
export default function MySpace({ locked }: { locked: boolean }) {
  return (
    <>
      <Light />
      {locked ? <TPVControls /> : <FPVControls />}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

import React from "react";
import FPVControls from "./components/FPVControls";
import Light from "./components/Light";
import Plane from "./components/Plane";
import ORBControls from "./components/ORBControls";

export default function MySpace() {
  console.log("rendered!");
  return (
    <>
      <Light />
      <FPVControls />
      <ORBControls />
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

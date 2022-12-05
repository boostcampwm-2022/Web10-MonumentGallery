import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import { useRef } from "react";
import TPVMovementController from "./components/TPVMovementController";
import Plane from "./mapObjects/Plane";
export default function MainWorld() {
  const ghostParentRef = useRef<THREE.Group>(null);
  return (
    <>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <TPVMovementController speed={10} />
        {/* <gridHelper args={[100, 100, 0]} /> */}
        <group ref={ghostParentRef}>
          <Player ghostParent={ghostParentRef.current} />
        </group>
        <Plane />
      </Physics>
    </>
  );
}

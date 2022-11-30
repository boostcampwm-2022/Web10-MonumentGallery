import { CameraHelper, PerspectiveCamera } from "three";
import { useHelper } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import MovementController from "../GalleryPage/components/MovementController";
import CollisionPlayerBody from "../GalleryPage/components/CollisionPlayerBody";
import Light from "../GalleryPage/mapObjects/Light";

import Ghost from "./mapObjects/Ghost";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import TPVCollisionPlayerBody from "./components/TPVCollisionPlayerBody";

export default function MainWorld({ cameraRef }: { cameraRef: React.MutableRefObject<PerspectiveCamera | null> }) {
  useHelper(cameraRef, CameraHelper);
  const ghostRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!cameraRef.current || !ghostRef.current) return;
    cameraRef.current.lookAt(ghostRef.current.position);
  });

  return (
    <>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <TPVCollisionPlayerBody />
        <MovementController speed={5} />
        <gridHelper args={[100, 100, 0]} />
        <group ref={ghostRef}>
          <Ghost ghost={ghostRef.current} />
        </group>
      </Physics>
    </>
  );
}

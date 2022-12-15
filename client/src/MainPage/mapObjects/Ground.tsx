import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import galleryStore from "../../store/gallery.store";
import { THEME } from "../../constants/theme";
import { GROUND_TEXTURES } from "../../constants/texture";
import { MAIN_CAMERA_Z } from "../../constants/positions";

export default function Ground() {
  const theme = galleryStore((store) => store.theme);
  const texture = useTexture(GROUND_TEXTURES[theme || THEME.DREAM]);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const { camera } = useThree();
  const groundRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    texture.offset.x = camera.position.x / 10;
    texture.offset.y = -camera.position.z / 10;
    groundRef.current.position.x = camera.position.x;
    groundRef.current.position.z = camera.position.z - MAIN_CAMERA_Z;
  });
  return (
    <mesh receiveShadow ref={groundRef} position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[50, 50]} />
      <meshLambertMaterial map={texture} map-repeat={[5, 5]} color="#999999" />
    </mesh>
  );
}

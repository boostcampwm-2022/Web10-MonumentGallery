import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import grass from "../../assets/images/grass.png";

export default function Ground() {
  const texture = useTexture(grass);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <mesh receiveShadow position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={texture} map-repeat={[100, 100]} color="#5a5a5a" />
    </mesh>
  );
}

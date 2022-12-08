import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import springGround from "../../assets/images/spring-ground.png";
import summerGround from "../../assets/images/summer-ground.png";
import autumnGround from "../../assets/images/autumn-ground.png";
import winterGround from "../../assets/images/winter-ground.png";
import dreamGround from "../../assets/images/dream-ground.png";

export default function Ground() {
  const texture = useTexture(springGround);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <mesh receiveShadow position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={texture} map-repeat={[100, 100]} color="#999999" />
    </mesh>
  );
}

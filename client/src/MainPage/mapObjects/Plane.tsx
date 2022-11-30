import * as THREE from "three";
export default function Plane() {
  return (
    <mesh rotation-x={-Math.PI * 0.5} scale={[100, 100, 100]}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
    </mesh>
  );
}

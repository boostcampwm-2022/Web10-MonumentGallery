import * as THREE from "three";
export default function Plane() {
  return (
    <mesh rotation-x={-Math.PI * 0.5} scale={[10, 10, 10]}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
    </mesh>
  );
}

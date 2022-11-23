import { animated, Interpolation } from "@react-spring/three";
import { MeshDistortMaterial } from "@react-three/drei";
import { Vector3Arr } from "../../@types/common";
import { COLORS } from "../../@types/colors";

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

interface BallonProps {
  position?: Vector3Arr;
  positionY: Interpolation<number, number>;
  scale: Interpolation<number, number>;
  color: Interpolation<number, COLORS>;
}

export default function Balloon({ position, positionY, scale, color }: BallonProps) {
  return (
    <animated.mesh position={position} position-y={positionY} scale={scale}>
      <sphereGeometry args={[1.5, 64, 32]} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <AnimatedMeshDistortMaterial speed={5} distort={0.3} color={color} />
    </animated.mesh>
  );
}

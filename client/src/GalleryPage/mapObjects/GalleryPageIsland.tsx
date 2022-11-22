import { IGalleryPageData } from "../../@types/gallery";
import Island from "./Island";
import React, { useMemo, useRef, useState } from "react";
import { a, Interpolation, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

interface AnimatedTitleProps {
  position: [x: number, y: number, z: number];
  text: string;
}

function AnimatedTitle({ position, text }: AnimatedTitleProps) {
  const [active, setActive] = useState(0);
  const [action, setAction] = useState(false);
  const { camera } = useThree();
  const meshRef = useRef<THREE.Group>(null);

  const { spring } = useSpring({
    spring: active,
    config: { tension: 500, friction: 150, precision: 0.04 },
    onStart: () => setAction(true),
    onRest: () => setAction(false),
  });

  const scale: Interpolation<number, number> = spring.to([0, 1], [-2, 4]);
  const balloonY: Interpolation<number, number> = spring.to([0, 1], [-2, 6]);

  const randomColors = useMemo(() => generateRandomPastelColors()[0], []);
  const color: Interpolation<number, COLORS> = spring.to([0, 1], [COLORS.SKY400, COLORS[randomColors]]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  useFrame(() => {
    if (!action) meshRef.current?.lookAt(camera.position);
    const { x, z: y } = camera.position;

    const distance = Math.abs(x - position[0]) + Math.abs(y - position[2]);

    if (distance < 15) {
      if (!active) setActive(+!active);
    } else {
      if (active) setActive(+!active);
    }
  });

  return (
    <>
      <a.group ref={meshRef} position={position} position-y={scale}>
        <a.mesh rotation-y={rotation} scale-z={scale} onClick={() => setActive(+!active)}>
          <Text
            visible={!(!active && !action)}
            font={MapoFlowerIsland}
            color="black"
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </a.mesh>
      </a.group>
      <Balloon position={position} positionY={balloonY} color={color} />
    </>
  );
}

export default function GalleryPageIsland({ position, title }: IGalleryPageData) {
  const [x, z] = position;

  return (
    <>
      <AnimatedTitle position={[x, 0, z]} text={title} />
      <Island x={x} z={z} />
    </>
  );
}

import { animated } from "@react-spring/three";
import { MeshDistortMaterial } from "@react-three/drei";
import { generateRandomPastelColors } from "../../utils/random";
import { COLORS } from "../../@types/colors";

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

interface BallonProps {
  position: [x: number, y: number, z: number];
  positionY: Interpolation<number, number>;
  color: Interpolation<number, COLORS>;
}

const Balloon = ({ position, positionY, color }: BallonProps) => {
  return (
    <a.mesh position={position} position-y={positionY}>
      <sphereGeometry args={[1.5, 64, 32]} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <AnimatedMeshDistortMaterial speed={5} distort={0.3} color={color} />
    </a.mesh>
  );
};

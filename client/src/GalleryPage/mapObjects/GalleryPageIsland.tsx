import { IGalleryPageData } from "../../@types/gallery";
import Island from "./Island";
import React, { useRef, useState } from "react";
import { a, useSpring } from "@react-spring/three";
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

  const scale = spring.to([0, 1], [0, 4]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  useFrame(() => {
    if (!action) meshRef.current?.lookAt(camera.position);
    const { x, z: y } = camera.position;
    if (x > position[0] - 8 && x < position[0] + 8 && y > position[2] - 8 && y < position[2] + 8) {
      if (!active) setActive(+!active);
    } else {
      if (active) setActive(+!active);
    }
  });

  return (
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

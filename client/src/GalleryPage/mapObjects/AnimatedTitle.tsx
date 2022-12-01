import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";

import Balloon from "./Balloon";
import { useBillboard } from "../../hooks/useBillboard";
import { useFrame } from "@react-three/fiber";
import { generateRandomPastelColors } from "../../utils/random";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

import { COLORS } from "../../@types/colors";
import type { ITriggeredSpringState } from "../../@types/common";

interface AnimatedTitleProps {
  text: string;
  animator: ITriggeredSpringState;
}

export default function AnimatedTitle({ text, animator }: AnimatedTitleProps) {
  const { spring, ready, playing } = animator;
  const textGroupRef = useBillboard<THREE.Group>({ follow: !playing });

  const textScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 4]), []);
  const balloonScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);
  const textY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 6]), []);
  const balloonY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 8]), []);
  const randomColors = useMemo<keyof typeof COLORS>(() => generateRandomPastelColors()[0], []);
  const color: Interpolation<number, COLORS> = spring.to([0, 1], [COLORS.SKY400, COLORS[randomColors]]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  useFrame(() => {
    console.log({ ready, playing });
  });

  return (
    <group visible={!!(ready || playing)}>
      <animated.group ref={textGroupRef} position-y={textY}>
        <animated.mesh rotation-y={rotation} scale={textScale}>
          <Text font={MapoFlowerIsland} color="black" fontSize={0.1} anchorX="center" anchorY="middle">
            {text}
          </Text>
        </animated.mesh>
      </animated.group>
      <Balloon positionY={balloonY} scale={balloonScale} color={color} />
    </group>
  );
}

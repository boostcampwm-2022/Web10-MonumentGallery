import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";

import Balloon from "./Balloon";
import { useBillboard } from "../../hooks/useBillboard";
import { generateRandomPastelColor } from "../../utils/random";
import { COLORS } from "../../constants/colors";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

import type { ITriggeredSpringState } from "../../@types/animator";

interface AnimatedTitleProps {
  text: string;
  animator: ITriggeredSpringState;
}

export default function AnimatedTitle({ text, animator }: AnimatedTitleProps) {
  const { spring, playing, active } = animator;
  const textGroupRef = useBillboard<THREE.Group>({ follow: !playing });

  const textScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 4]), []);
  const balloonScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);
  const textY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 6]), []);
  const balloonY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 8]), []);
  const color: Interpolation<number, COLORS> = useMemo(() => {
    return spring.to([0, 1], [COLORS.SKY400, generateRandomPastelColor()]);
  }, []);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  return (
    <group visible={active}>
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

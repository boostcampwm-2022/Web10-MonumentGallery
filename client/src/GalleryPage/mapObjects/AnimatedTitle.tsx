import { useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { animated, Interpolation, useSpring } from "@react-spring/three";

import Balloon from "./Balloon";
import { useBillboard } from "../../hooks/useBillboard";
import { useDistanceEvent } from "../../hooks/useDistanceEvent";

import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import { generateRandomPastelColors } from "../../utils/random";
import { COLORS } from "../../@types/colors";

interface AnimatedTitleProps {
  position: [x: number, y: number, z: number];
  text: string;
}

export default function AnimatedTitle({ position, text }: AnimatedTitleProps) {
  const [active, setActive] = useState(0);
  const [action, setAction] = useState(false);
  const textGroupRef = useBillboard<THREE.Group>({ follow: !action });

  const { spring } = useSpring({
    spring: active,
    config: { tension: 500, friction: 150, precision: 0.04 },
    onStart: () => setAction(true),
    onRest: () => setAction(false),
  });

  const textScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 4]), []);
  const balloonScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);
  const textY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 6]), []);
  const balloonY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 8]), []);
  const randomColors = useMemo<keyof typeof COLORS>(() => generateRandomPastelColors()[0], []);
  const color: Interpolation<number, COLORS> = spring.to([0, 1], [COLORS.SKY400, COLORS[randomColors]]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  useDistanceEvent({
    area: { type: "circle", x: position[0], z: position[2], radius: 15 },
    enterEvent: () => setActive(1),
    exitEvent: () => setActive(0),
  });

  return (
    <>
      <animated.group ref={textGroupRef} position={position} position-y={textY}>
        <animated.mesh rotation-y={rotation} scale={textScale} onClick={() => setActive(+!active)}>
          <Text
            visible={!(!active && !action)}
            font={MapoFlowerIsland}
            color="black"
            fontSize={0.1}
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </animated.mesh>
      </animated.group>
      <Balloon position={position} positionY={balloonY} scale={balloonScale} color={color} />
    </>
  );
}

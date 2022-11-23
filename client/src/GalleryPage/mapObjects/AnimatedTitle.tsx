import { useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";
import { BallCollider, RigidBody } from "@react-three/rapier";

import Balloon from "./Balloon";
import { useBillboard } from "../../hooks/useBillboard";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import { generateRandomPastelColors } from "../../utils/random";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

import { COLORS } from "../../@types/colors";

interface AnimatedTitleProps {
  text: string;
}

export default function AnimatedTitle({ text }: AnimatedTitleProps) {
  const [collision, setCollision] = useState(false);
  const { spring, playing } = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const textGroupRef = useBillboard<THREE.Group>({ follow: !playing });

  const textScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 4]), []);
  const balloonScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);
  const textY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 6]), []);
  const balloonY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 8]), []);
  const randomColors = useMemo<keyof typeof COLORS>(() => generateRandomPastelColors()[0], []);
  const color: Interpolation<number, COLORS> = spring.to([0, 1], [COLORS.SKY400, COLORS[randomColors]]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      onCollisionEnter={() => setCollision(true)}
      onCollisionExit={() => setCollision(false)}
    >
      <BallCollider args={[15]} />
      <animated.group ref={textGroupRef} position-y={textY}>
        <animated.mesh rotation-y={rotation} scale={textScale}>
          <Text font={MapoFlowerIsland} color="black" fontSize={0.1} anchorX="center" anchorY="middle">
            {text}
          </Text>
        </animated.mesh>
      </animated.group>
      <Balloon positionY={balloonY} scale={balloonScale} color={color} />
    </RigidBody>
  );
}

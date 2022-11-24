import { animated, Interpolation } from "@react-spring/three";
import { Cloud } from "@react-three/drei";
import { useMemo } from "react";
import { ITriggeredSpringState } from "../../@types/common";

interface SkyCloudProps {
  animator: ITriggeredSpringState;
}

export default function SkyCloud({ animator }: SkyCloudProps) {
  const { spring } = animator;
  const positionY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-5, -10]), []);

  return (
    <animated.group position-y={positionY}>
      <Cloud position={[0, 0, 0]} speed={0.2} opacity={0.5} />
      <Cloud position={[0, 0, 7]} speed={0.2} opacity={0.5} />
      <Cloud position={[0, 0, -7]} speed={0.2} opacity={0.5} />
      <Cloud position={[7, 0, 0]} speed={0.2} opacity={0.5} />
      <Cloud position={[-7, 0, 0]} speed={0.2} opacity={0.5} />
    </animated.group>
  );
}

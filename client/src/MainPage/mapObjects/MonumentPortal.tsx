import { animated, Interpolation } from "@react-spring/three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "@react-three/fiber";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import { Portal } from "./Portal";
import { Text } from "@react-three/drei";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
interface MonumentPedalProps {
  link: string;
  position: Vector3;
}
export default function MonumentPortal({ link, position }: MonumentPedalProps) {
  const [collision, setCollision] = useState(false);
  const { spring } = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const animatedScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0.5, 1]), []);

  useEffect(() => {
    if (!collision) return;

    function onEnter(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      window.location.href = link;
    }
    document.addEventListener("keydown", onEnter);
    return () => document.removeEventListener("keydown", onEnter);
  }, [collision]);

  return (
    <RigidBody
      type="fixed"
      position={position}
      colliders={false}
      onCollisionEnter={() => {
        setCollision(true);
      }}
      onCollisionExit={() => {
        setCollision(false);
      }}
    >
      <animated.mesh scale={animatedScale}>
        <Portal rotation={[0, Math.PI / 4, 0]} />
      </animated.mesh>
      <CuboidCollider args={[1, 1, 1]} />
      {collision && (
        <Text
          font={MapoFlowerIsland}
          color="black"
          position={[2, 0, 2]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, Math.PI / 4, 0, "YXZ"]}
        >
          Space를 눌러 입장하세요
        </Text>
      )}
    </RigidBody>
  );
}

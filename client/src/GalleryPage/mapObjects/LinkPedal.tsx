import "./styles/Linkpedal.style.scss";

import { useEffect, useMemo, useState } from "react";
import { Euler, GroupProps } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { animated, Interpolation } from "@react-spring/three";

import Stone from "./Stone";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import { generateRandomPosition } from "../../utils/random";

import { Vector3Arr } from "../../@types/common";
import { IGalleryPageLink } from "../../@types/gallery";

interface LinkPedalsProps extends GroupProps {
  links: IGalleryPageLink[];
}

export default function LinkPedals({ links, ...props }: LinkPedalsProps) {
  const positions = useMemo(() => generateRandomPosition("stone", links.length), []);
  return (
    <group {...props}>
      {links.map((link, i) => (
        <LinkPedal key={i} link={link} position={[positions[i][0], 0, positions[i][1]]} />
      ))}
    </group>
  );
}

interface LinkPedalProps {
  link: IGalleryPageLink;
  position: Vector3Arr;
}

function LinkPedal({ link, position }: LinkPedalProps) {
  const [collision, setCollision] = useState(false);
  const { spring } = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const scale = useMemo(() => Math.random() * 0.2, []);
  const animatedScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [scale + 0.2, scale + 0.5]), []);
  const rotated = useMemo<Euler>(() => [0, Math.random() * 180, 0], []);

  useEffect(() => {
    if (!collision) return;

    function onEnter(e: KeyboardEvent) {
      if (e.code !== "Enter") return;
      window.open(link.href);
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
        <Stone rotation={rotated} />
      </animated.mesh>
      <CuboidCollider args={[1 * scale, 1, 1 * scale]} />
      {collision && (
        <Html center className="pedal-html">
          <div>
            <div>Enter 클릭 시 이동</div>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.href}
            </a>
          </div>
        </Html>
      )}
    </RigidBody>
  );
}

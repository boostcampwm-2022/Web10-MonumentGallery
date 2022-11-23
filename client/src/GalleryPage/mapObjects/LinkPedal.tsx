import "./styles/Linkpedal.style.scss";
import { Html } from "@react-three/drei";
import React, { useEffect, useMemo, useState } from "react";
import { IGalleryPageLink } from "../../@types/gallery";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { generateRandomPosition } from "../../utils/random";
import Stone from "./Stone";
import { Euler } from "@react-three/fiber";

interface LinkPedalsProps {
  links: IGalleryPageLink[];
  position: [x: number, y: number, z: number];
}

export default function LinkPedals({ links, position }: LinkPedalsProps) {
  const positions = useMemo(() => generateRandomPosition(links.length), []);
  return (
    <>
      {links.map((link, i) => (
        <LinkPedal key={i} link={link} position={[position[0] + positions[i][0], 0, position[2] + positions[i][1]]} />
      ))}
    </>
  );
}

interface LinkPedalProps {
  link: IGalleryPageLink;
  position: [x: number, y: number, z: number];
}

function LinkPedal({ link, position }: LinkPedalProps) {
  const [collision, setCollision] = useState(false);
  const rotated = useMemo<Euler>(() => [0, Math.random() * 180, 0], []);
  const scale = useMemo(() => Math.random() * 0.2 + 0.2, []);

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
      colliders={false}
      position={position}
      onCollisionEnter={() => {
        setCollision(true);
      }}
      onCollisionExit={() => {
        setCollision(false);
      }}
    >
      <mesh>
        <Stone rotation={rotated} scale={scale} />
        <CuboidCollider args={[1 * scale, 1, 1 * scale]} />
      </mesh>
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

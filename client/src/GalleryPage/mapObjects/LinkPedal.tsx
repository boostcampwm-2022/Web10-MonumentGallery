import "./styles/Linkpedal.style.scss";
import { Html } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { IGalleryPageLink } from "../../@types/gallery";
import { RigidBody } from "@react-three/rapier";

interface LinkPedalProps {
  link: IGalleryPageLink;
  position: THREE.Vector3 | [x: number, y: number, z: number];
}

export default function LinkPedal({ link, position }: LinkPedalProps) {
  const [collision, setCollision] = useState(false);

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
      type="dynamic"
      colliders="cuboid"
      position={position}
      onCollisionEnter={() => {
        setCollision(true);
      }}
      onCollisionExit={() => {
        setCollision(false);
      }}
    >
      <mesh>
        <boxGeometry args={[1, 0.3, 1]} />
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

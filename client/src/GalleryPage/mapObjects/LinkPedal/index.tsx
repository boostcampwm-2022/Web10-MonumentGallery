import { useState, useEffect } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

import LinkPedalHtml from "./Text";
import LinkPedalEffect from "./Effect";
import pedalShader from "./PedalShader";

import type { Dispatch, SetStateAction } from "react";
import type { Vector3Arr } from "../../../@types/common";
import type { IGalleryPageLink } from "../../../@types/gallery";

interface LinkPedalFloorProps {
  setActive: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
}

interface LinkPedalProps {
  link: IGalleryPageLink;
  position: Vector3Arr;
}

function LinkPedalFloor({ setActive, onClick }: LinkPedalFloorProps) {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
      onClick={onClick}
    >
      <planeGeometry />
      <shaderMaterial {...pedalShader} />
    </mesh>
  );
}

export default function LinkPedal({ link, position }: LinkPedalProps) {
  const [collision, setCollision] = useState(false);

  function openLink() {
    window.open(link.href);
  }

  useEffect(() => {
    if (!collision) return;

    function onEnter(e: KeyboardEvent) {
      if (e.code !== "Enter") return;
      openLink();
    }
    document.addEventListener("keydown", onEnter);
    return () => document.removeEventListener("keydown", onEnter);
  }, [collision]);

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider
        args={[1, 1, 1]}
        sensor
        onIntersectionEnter={() => setCollision(true)}
        onIntersectionExit={() => setCollision(false)}
      />
      <LinkPedalFloor setActive={setCollision} onClick={openLink} />
      <LinkPedalEffect active={collision} />
      <LinkPedalHtml href={link.href} visible={collision} />
    </RigidBody>
  );
}

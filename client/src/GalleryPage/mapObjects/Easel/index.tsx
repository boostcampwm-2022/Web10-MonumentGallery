import { useState } from "react";
import { OBJLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import GalleryGuideModal from "./Modal";
import EaselObj from "../../../assets/models/easel.obj?url";
import EaselTexture from "../../../assets/images/easel-texture.png";

import type { Mesh } from "three";
import type { GroupProps } from "@react-three/fiber";

function useEaselLoader() {
  const group = useLoader(OBJLoader, EaselObj);
  if (Array.isArray(group)) throw new Error("잘못된 obj파일");
  const easel = group.children[0] as Mesh;
  const pannel = group.children[1] as Mesh;
  return [easel.geometry, pannel.geometry];
}

export default function Easel(props: GroupProps) {
  const [showSign, setShowSign] = useState(false);
  const [easelGeometry, pannelGeometry] = useEaselLoader();
  const texture = useTexture(EaselTexture);
  return (
    <group {...props}>
      <mesh castShadow geometry={easelGeometry}>
        <meshLambertMaterial color={0x906746} />
      </mesh>
      <mesh castShadow geometry={pannelGeometry} onClick={() => setShowSign(true)}>
        <GalleryGuideModal show={showSign} setShow={setShowSign} />
        <meshLambertMaterial toneMapped={false} map={texture} color={0xf3f3f3} />
      </mesh>
    </group>
  );
}

useLoader.preload(OBJLoader, EaselObj);

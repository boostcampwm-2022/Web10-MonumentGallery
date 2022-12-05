import { BallCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import SubWordCloud from "../../GalleryPage/mapObjects/SubWordCloud";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import Monolith from "./Monolith";
import TextRing from "./TextRing";

export default function Monument() {
  const [collision, setCollision] = useState(false);
  const springs = useTriggeredSpring(true, { tension: 500, friction: 150, precision: 0.04 });
  return (
    <>
      <Monolith />
      <TextRing text="가나다라마바사" position={[0, 1, 0]} scale={[0.7, 0.7, 0.7]} />
      <TextRing text="ABCDEFG" position={[0, 2, 0]} scale={[0.6, 0.6, 0.6]} />
      <TextRing text="라스트제목" position={[0, 3, 0]} scale={[0.5, 0.5, 0.5]} />
    </>
  );
}

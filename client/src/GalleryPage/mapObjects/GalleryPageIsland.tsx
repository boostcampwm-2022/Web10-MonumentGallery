import { useState } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";

import Island from "./Island";
import MemorialStones from "./MemorialStone";
import AnimatedTitle from "./AnimatedTitle";
import SubWordCloud from "./SubWordCloud";
import LinkPedals from "./LinkPedal";

import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import { IGalleryPageData } from "../../@types/gallery";

export default function GalleryPageIsland({ position, subtitle, title, keywords, links }: IGalleryPageData) {
  const [x, z] = position;
  const [collision, setCollision] = useState(false);
  const springs = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[x, 0, z]}
      onCollisionEnter={() => setCollision(true)}
      onCollisionExit={() => setCollision(false)}
    >
      <BallCollider args={[10]} />
      <AnimatedTitle text={title} animator={springs} />
      <Island />
      <MemorialStones subtitles={subtitle} />
      <SubWordCloud keywords={keywords} radius={5} scale={0.8} animator={springs} />
      {links && <LinkPedals links={links} />}
    </RigidBody>
  );
}

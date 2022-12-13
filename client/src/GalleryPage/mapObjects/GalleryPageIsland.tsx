import { useState } from "react";
import { BallCollider, RigidBody } from "@react-three/rapier";

import Island from "./Island";
import MemorialStones from "./MemorialStone";
import AnimatedTitle from "./AnimatedTitle";
import SubWordCloud from "./SubWordCloud";
import LinkPedals from "./LinkPedals";
import PictureFragments from "./PictureFragments";

import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import galleryStore from "../../store/gallery.store";
import { ISLAND_COLORS } from "../../constants/colors";
import { THEME } from "../../constants/theme";

import type { IGalleryPageData } from "../../@types/gallery";

export default function GalleryPageIsland({
  position,
  subtitle,
  title,
  keywords,
  links,
  imagePixel,
}: IGalleryPageData) {
  const [x, z] = position;
  const [collision, setCollision] = useState(false);
  const springs = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const theme = galleryStore((store) => store.theme);

  return (
    <RigidBody type="fixed" colliders={false} position={[x, 0, z]}>
      <BallCollider
        args={[10]}
        sensor
        onIntersectionEnter={() => setCollision(true)}
        onIntersectionExit={() => setCollision(false)}
      />
      <AnimatedTitle text={title} animator={springs} />
      <Island color={(theme && ISLAND_COLORS[theme]) || THEME.DREAM} />
      <MemorialStones subtitles={subtitle} animator={springs} />
      <SubWordCloud keywords={keywords} radius={6} scale={0.8} animator={springs} />
      {links && <LinkPedals links={links} />}
      {imagePixel && Array.isArray(imagePixel[0]) && <PictureFragments pixels={imagePixel} />}
    </RigidBody>
  );
}

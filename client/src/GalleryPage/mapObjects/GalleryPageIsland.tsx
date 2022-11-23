import Island from "./Island";
import MemorialStones from "./MemorialStone";
import AnimatedTitle from "./AnimatedTitle";
import SubWordCloud from "./SubWordCloud";
import LinkPedals from "./LinkPedal";

import { IGalleryPageData } from "../../@types/gallery";

export default function GalleryPageIsland({ position, subtitle, title, keywords, links }: IGalleryPageData) {
  const [x, z] = position;

  return (
    <group position={[x, 0, z]}>
      <AnimatedTitle text={title} />
      <Island />
      <MemorialStones subtitles={subtitle} />
      <SubWordCloud keywords={keywords} position-y={2} radius={5} scale={0.8} />
      {links && <LinkPedals links={links} />}
    </group>
  );
}

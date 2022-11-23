import Island from "./Island";
import MemorialStones from "./MemorialStone";
import AnimatedTitle from "./AnimatedTitle";
import SubWordCloud from "./SubWordCloud";

import { IGalleryPageData } from "../../@types/gallery";

export default function GalleryPageIsland({ position, subtitle, title, keywords }: IGalleryPageData) {
  const [x, z] = position;

  return (
    <>
      <AnimatedTitle position={[x, 0, z]} text={title} />
      <Island x={x} z={z} />
      <MemorialStones position={[x, z]} subtitles={subtitle} />
      <SubWordCloud keywords={keywords} position={[x, 2, z]} radius={5} scale={0.8} />
    </>
  );
}

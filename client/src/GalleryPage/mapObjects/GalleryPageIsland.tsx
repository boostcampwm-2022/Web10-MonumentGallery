import Island from "./Island";
import MemorialStones from "./MemorialStone";
import AnimatedTitle from "./AnimatedTitle";
import { IGalleryPageData } from "../../@types/gallery";
import LinkPedals from "./LinkPedal";

export default function GalleryPageIsland({ position, subtitle, title, links }: IGalleryPageData) {
  const [x, z] = position;

  return (
    <>
      <AnimatedTitle position={[x, 0, z]} text={title} />
      <Island x={x} z={z} />
      <MemorialStones position={[x, z]} subtitles={subtitle} />
      {links && <LinkPedals links={links} position={[x, 0, z]} />}
    </>
  );
}

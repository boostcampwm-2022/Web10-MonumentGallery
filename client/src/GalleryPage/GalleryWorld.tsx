import GalleryPageIsland from "./mapObjects/GalleryPageIsland";
import GalleryCenterIsland from "./mapObjects/GalleryCenterIsland";
import Bridge from "./mapObjects/Bridge";
import { IGalleryMapData, IGalleryPageData } from "../@types/gallery";

interface GalleryWorldProps {
  data: IGalleryMapData;
}

type Vector3Arr = [x: number, y: number, z: number];

export default function GalleryWorld({ data }: GalleryWorldProps) {
  const { totalKeywords, pages, nodes } = data;

  const pageIslandPosition = pages.map(({ position }: IGalleryPageData): Vector3Arr => [position[0], 0, position[1]]);
  const getIslandPosition = (i: number): Vector3Arr => {
    if (i === -1) return [0, 0, 0];
    return pageIslandPosition[i];
  };

  return (
    <>
      <GalleryCenterIsland keywords={totalKeywords} />
      {pages.map((pageData: IGalleryPageData, i: number) => {
        const id = `${pageData.title}__${i}`;
        return <GalleryPageIsland {...pageData} key={id} />;
      })}
      {nodes.map((nodeData: number[]) => {
        const start = getIslandPosition(nodeData[0]);
        const end = getIslandPosition(nodeData[1]);
        return <Bridge start={start} end={end} key={`<${nodeData.join(",")}>`} />;
      })}
    </>
  );
}

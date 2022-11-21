import GalleryPageIsland from "./mapObjects/GalleryPageIsland";
import GalleryCenterIsland from "./mapObjects/GalleryCenterIsland";
import Bridge from "./mapObjects/Bridge";
import { IGallaryMapData } from "../@types/common";

interface GalleryWorldProps {
  data: IGallaryMapData;
}

export default function GalleryWorld({ data }: GalleryWorldProps) {
  const { totalKeywords, pages, nodes } = data;
  console.log(data);

  const pageIslandPosition = pages.map(({ position }) => [position[0], 0, position[1]] as const);
  const getIslandPosition = (i: number): [x: number, y: number, z: number] => {
    if (i === -1) return [0, 0, 0];
    return pageIslandPosition[i];
  };

  return (
    <>
      <GalleryCenterIsland />
      {pages.map((pageData, i) => {
        const id = `${pageData.title}__${i}`;
        return <GalleryPageIsland {...pageData} key={id} />;
      })}
      {nodes.map((nodeData) => {
        const start = getIslandPosition(nodeData[0]);
        const end = getIslandPosition(nodeData[1]);
        return <Bridge start={start} end={end} key={`<${nodeData.join(",")}>`} />;
      })}
    </>
  );
}

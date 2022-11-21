import GalleryPageIsland from "./mapObjects/GalleryPageIsland";
import GalleryCenterIsland from "./mapObjects/GalleryCenterIsland";
import { IGallaryMapData } from "../@types/common";

interface GalleryWorldProps {
  data: IGallaryMapData;
}

export default function GalleryWorld({ data }: GalleryWorldProps) {
  const { totalKeywords, pages, nodes } = data;

  return (
    <>
      <GalleryCenterIsland />
      {pages.map((pageData, i) => {
        const id = `${pageData.title}__${i}`;
        return <GalleryPageIsland {...pageData} key={id} />;
      })}
    </>
  );
}

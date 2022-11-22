import Island from "./Island";
import MainWordCloud from "./MainWordCloud";
import { IKeywordMap } from "../../@types/gallery";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
}

export default function GalleryCenterIsland({ keywords }: GalleryCenterIslandProps) {
  return (
    <>
      <Island x={0} z={0} color={0xaaffff} />
      <MainWordCloud keywords={keywords} position={[0, 2, 0]} scale={0.3} />
    </>
  );
}

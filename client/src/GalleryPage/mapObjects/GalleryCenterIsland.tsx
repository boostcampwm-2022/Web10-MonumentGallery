import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import { IKeywordMap } from "../../@types/gallery";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
}

export default function GalleryCenterIsland({ keywords }: GalleryCenterIslandProps) {
  return (
    <>
      <Island x={0} z={0} islandScale={8} color={0xaaffff} />
      <Monolith />
      <MainWordCloud keywords={keywords} position={[0, 7, 0]} scale={0.8} />
    </>
  );
}

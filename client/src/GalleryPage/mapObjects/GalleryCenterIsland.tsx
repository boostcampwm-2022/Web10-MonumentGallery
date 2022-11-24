import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import { IKeywordMap } from "../../@types/gallery";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
}

export default function GalleryCenterIsland({ keywords }: GalleryCenterIslandProps) {
  return (
    <group>
      <Island islandScale={8} color={0xaaffff} />
      <Monolith />
      <MainWordCloud keywords={keywords} />
    </group>
  );
}

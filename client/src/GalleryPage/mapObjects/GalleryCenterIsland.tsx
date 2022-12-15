import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import Sign from "./Sign";
import Easel from "./Easel";

import galleryStore from "../../store/gallery.store";
import { CENTER_ISLAND_COLORS } from "../../constants/colors";
import { THEME } from "../../constants/theme";

import type { IGroupKeywordData, IKeywordMap } from "../../@types/gallery";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
  groupKeywords: IGroupKeywordData[];
}

export default function GalleryCenterIsland({ keywords, groupKeywords }: GalleryCenterIslandProps) {
  const theme = galleryStore((store) => store.theme);
  return (
    <group>
      <Island islandScale={8} color={(theme && CENTER_ISLAND_COLORS[theme]) || THEME.DREAM} />
      <Monolith />
      <Sign groupKeywords={groupKeywords} />
      <MainWordCloud keywords={keywords} />
      <Easel position={[4, 0, -4]} rotation-y={-Math.PI / 4} scale={0.9} />
    </group>
  );
}

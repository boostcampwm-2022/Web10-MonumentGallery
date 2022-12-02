import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import Sign from "./Sign";

import galleryStore from "../../store/gallery.store";

import { IGroupKeywordData, IKeywordMap, THEME } from "../../@types/gallery";
import { CENTER_ISLAND_COLORS } from "../../@types/colors";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
  groupKeywords: IGroupKeywordData[];
}

export default function GalleryCenterIsland({ keywords, groupKeywords }: GalleryCenterIslandProps) {
  const { theme } = galleryStore();
  return (
    <group>
      <Island islandScale={8} color={(theme && CENTER_ISLAND_COLORS[theme]) || THEME.DREAM} />
      <Monolith />
      <Sign groupKeywords={groupKeywords} />
      <MainWordCloud keywords={keywords} />
    </group>
  );
}

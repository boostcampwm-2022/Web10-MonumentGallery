import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import { IGroupKeywordData, IKeywordMap, THEME } from "../../@types/gallery";
import themeStore from "../../store/theme.store";
import { CENTER_ISLAND_COLORS } from "../../@types/colors";
import Sign from "./Sign";
interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
  groupKeywords: IGroupKeywordData[];
}

export default function GalleryCenterIsland({ keywords, groupKeywords }: GalleryCenterIslandProps) {
  const { theme } = themeStore();

  return (
    <group>
      <Island islandScale={8} color={(theme && CENTER_ISLAND_COLORS[theme]) || THEME.DREAM} />
      <Monolith />
      <Sign groupKeywords={groupKeywords} />
      <MainWordCloud keywords={keywords} />
    </group>
  );
}

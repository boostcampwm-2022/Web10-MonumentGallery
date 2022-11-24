import Island from "./Island";
import Monolith from "./Monolith";
import MainWordCloud from "./MainWordCloud";
import { IKeywordMap, THEME } from "../../@types/gallery";
import themeStore from "../../store/theme.store";
import { CENTER_ISLAND_COLORS } from "../../@types/colors";

interface GalleryCenterIslandProps {
  keywords: IKeywordMap;
}

export default function GalleryCenterIsland({ keywords }: GalleryCenterIslandProps) {
  const { theme } = themeStore();
  return (
    <group>
      <Island islandScale={8} color={(theme && CENTER_ISLAND_COLORS[theme]) || THEME.DREAM} />
      <Monolith />
      <MainWordCloud keywords={keywords} />
    </group>
  );
}

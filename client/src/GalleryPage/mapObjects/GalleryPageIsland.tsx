import { useMemo } from "react";
import { IGalleryPageData, IGalleryPageSubTitle } from "../../@types/gallery";
import Island from "./Island";
import MemorialStone from "./MemorialStone";

interface IStoneInfo {
  subtitle: IGalleryPageSubTitle;
  stonePosition: number[];
}
function calculateMemorialStonePosition(subtitles: IGalleryPageSubTitle[]) {
  const enalblePositions = [
    [0, 0],
    [1, 1],
    [-1, -1],
    [2, 0],
    [-2, 0],
    [3, 1],
    [-3, -1],
  ];
  let cursor = 0;
  const stoneInfoList: IStoneInfo[] = [];
  const h1List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.type === "h1");
  const h2List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.type === "h2");
  const h3List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.type === "h3");
  while (cursor < enalblePositions.length) {
    if (h1List.length > 0) {
      const subtitle = h1List.pop();
      if (subtitle) {
        stoneInfoList.push({
          subtitle,
          stonePosition: enalblePositions[cursor],
        });
        cursor++;
        continue;
      }
    } else if (h2List.length > 0) {
      const subtitle = h2List.pop();
      if (subtitle) {
        stoneInfoList.push({
          subtitle,
          stonePosition: enalblePositions[cursor],
        });
        cursor++;
        continue;
      }
      cursor++;
      continue;
    } else if (h3List.length > 0) {
      const subtitle = h3List.pop();
      if (subtitle) {
        stoneInfoList.push({
          subtitle,
          stonePosition: enalblePositions[cursor],
        });
        cursor++;
        continue;
      }
    } else {
      break;
    }
  }
  return stoneInfoList;
}
export default function GalleryPageIsland({ position, subtitle }: IGalleryPageData) {
  const stoneInfoList = useMemo(() => {
    return calculateMemorialStonePosition(subtitle);
  }, []);
  return (
    <>
      <Island x={position[0]} z={position[1]} />
      {stoneInfoList.map((stoneInfo, i) => {
        const { subtitle, stonePosition } = stoneInfo;
        const key = `${subtitle}+${i}`;
        return <MemorialStone subTitle={subtitle} position={position.map((e, i) => e + stonePosition[i])} key={key} />;
      })}
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Object3D } from "three";
import { Text } from "@react-three/drei";

import Pedestal from "./Pedestal";
import { useBillboard } from "../../hooks/useBillboard";

import { IGalleryPageSubTitle } from "../../@types/gallery";
import { COLORS } from "../../@types/colors";
import MapoFont from "../../assets/MapoFlowerIsland.otf";

interface MemorialStonesProps {
  subtitles: IGalleryPageSubTitle[];
}

interface MemorialStoneProps {
  subTitle: IGalleryPageSubTitle;
  position: number[];
}

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
  const h1List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.hType === "h1");
  const h2List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.hType === "h2");
  const h3List = subtitles.filter((subTitle: IGalleryPageSubTitle) => subTitle.hType === "h3");
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

function textPreProcessing(text: string) {
  const letters = text.split("");
  let visibleLetters: string[] = [];
  let invisibleLetters: string[] = [];
  if (letters.length > 10) {
    visibleLetters = letters.slice(0, 10);
    invisibleLetters = letters.slice(10);
  } else {
    visibleLetters = letters;
  }
  return { visibleLetters, invisibleLetters };
}
function getStyleByTitleType(type: string) {
  let textSize = 0;
  let stoneColor = "";
  switch (type) {
    case "h1":
      textSize = 0.6;
      stoneColor = COLORS.BROWN200;
      break;
    case "h2":
      textSize = 0.4;
      stoneColor = COLORS.BROWN100;
      break;
    case "h3":
      textSize = 0.3;
      stoneColor = COLORS.BROWN50;
      break;
    default:
      break;
  }
  return { textSize, stoneColor };
}

function MemorialStone({ subTitle, position }: MemorialStoneProps) {
  const { text, hType } = subTitle;
  const { textSize, stoneColor } = getStyleByTitleType(hType);
  const [pText, setPText] = useState("");

  const { visibleLetters, invisibleLetters } = useMemo(() => {
    const { visibleLetters, invisibleLetters } = textPreProcessing(text);
    setPText(visibleLetters.join(" "));
    return { visibleLetters, invisibleLetters };
  }, []);

  const subtitleMeshRef = useBillboard<THREE.Mesh>({ lockElevation: true });
  const subtitleRef = useRef<Object3D>(null);

  useEffect(() => {
    const needAnimation = invisibleLetters.length > 0 ? true : false;
    let animation: ReturnType<typeof setInterval>;
    if (needAnimation) {
      animation = setInterval(() => {
        if (!subtitleRef.current) return;
        const letter = visibleLetters.pop();
        if (letter) {
          invisibleLetters.push(letter);
        }
        const newLetter = invisibleLetters.shift();
        if (newLetter) {
          visibleLetters.unshift(newLetter);
        }
        setPText(visibleLetters.join(" "));
      }, 300);
    }
    return () => {
      if (needAnimation) {
        clearInterval(animation);
      }
    };
  }, []);

  return (
    <group position={[position[0], 0, position[1]]} scale={textSize}>
      <Pedestal scale={0.5} color={stoneColor} />
      <mesh ref={subtitleMeshRef} position-y={textSize * (visibleLetters.length / 2) + 0.5}>
        <Text
          ref={subtitleRef}
          font={MapoFont}
          fontSize={textSize}
          color={"black"}
          maxWidth={0.1}
          textAlign={"center"}
          lineHeight={1}
        >
          {pText}
        </Text>
      </mesh>
    </group>
  );
}

export default function MemorialStones({ subtitles }: MemorialStonesProps) {
  const stoneInfoList = useMemo(() => {
    return calculateMemorialStonePosition(subtitles);
  }, []);

  return (
    <>
      {stoneInfoList.map((stoneInfo, i) => {
        const { subtitle, stonePosition } = stoneInfo;
        const key = `${subtitle}+${i}`;
        return <MemorialStone subTitle={subtitle} position={stonePosition} key={key} />;
      })}
    </>
  );
}

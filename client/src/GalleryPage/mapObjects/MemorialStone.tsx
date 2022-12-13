import { useEffect, useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { animated } from "@react-spring/three";

import Pedestal from "./Pedestal";
import { useBillboard } from "../../hooks/useBillboard";

import { COLORS } from "../../@types/colors";
import type { Mesh } from "three";
import type { ITriggeredSpringState } from "../../@types/animator";
import type { IGalleryPageSubTitle } from "../../@types/gallery";
import MapoFont from "../../assets/fonts/MapoFlowerIsland.otf";

interface ElevateTextProps {
  text: string;
  textSize: number;
}

interface MemorialStonesProps {
  subtitles: IGalleryPageSubTitle[];
  animator: ITriggeredSpringState;
}

interface MemorialStoneProps {
  subTitle: IGalleryPageSubTitle;
  animator: ITriggeredSpringState;
  position: number[];
}

interface IStoneInfo {
  subtitle: IGalleryPageSubTitle;
  stonePosition: number[];
}

const MAX_VISIBLE_LENGTH = 10;

function insertSpace(str: string) {
  const result = str.replace(/\s/g, "·").replace(/(.)/g, "$1 ");
  return result;
}

function calculateMemorialStonePosition(subtitles: IGalleryPageSubTitle[]): IStoneInfo[] {
  const enalblePositions = [
    [0, 0],
    [1, 1],
    [-1, -1],
    [2, 0],
    [-2, 0],
    [3, 1],
    [-3, -1],
  ];
  function getHtypePriority(hType: string): number {
    if (typeof hType === "string" && hType[0] === "h") {
      return Number(hType[1]);
    }
    return 4;
  }

  return [...subtitles]
    .sort((a, b) => getHtypePriority(a.hType) - getHtypePriority(b.hType))
    .slice(0, enalblePositions.length)
    .map((subtitle: IGalleryPageSubTitle, i: number) => ({
      subtitle,
      stonePosition: enalblePositions[i],
    }));
}

function getStyleByTitleType(type: string) {
  switch (type) {
    case "h1":
      return { textSize: 0.6, stoneColor: COLORS.BROWN200 };
    case "h2":
      return { textSize: 0.4, stoneColor: COLORS.BROWN100 };
    case "h3":
      return { textSize: 0.3, stoneColor: COLORS.BROWN50 };
    default:
      return { textSize: 0, stoneColor: "#222222" };
  }
}

function ElevateText({ text, textSize }: ElevateTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const visibleText = useMemo(() => {
    if (text.length <= MAX_VISIBLE_LENGTH) return insertSpace(text);
    return insertSpace((text + text).slice(textIndex, textIndex + MAX_VISIBLE_LENGTH));
  }, [text, textIndex]);

  useEffect(() => {
    if (text.length <= MAX_VISIBLE_LENGTH) return;

    const animation = setInterval(() => {
      setTextIndex((idx) => (idx + 1) % text.length);
    }, 300);
    return () => {
      clearInterval(animation);
    };
  }, [text]);

  return (
    <Text font={MapoFont} fontSize={textSize} color={"black"} maxWidth={0.1} textAlign={"center"} lineHeight={1}>
      {visibleText}
    </Text>
  );
}

function MemorialStone({ subTitle, position, animator }: MemorialStoneProps) {
  const { text, hType } = subTitle;
  const { textSize, stoneColor } = getStyleByTitleType(hType);

  const subtitleMeshRef = useBillboard<Mesh>({ lockElevation: true });

  const yPositionOrigin = textSize * (Math.min(text.length, MAX_VISIBLE_LENGTH) / 2) + 0.5;
  const { spring, active } = animator;
  const yPosition = useMemo(() => spring.to([0, 1], [-yPositionOrigin, yPositionOrigin]), []);
  const scale = useMemo(() => spring.to([0, 1], [0, 1]), []);

  return (
    <group position={[position[0], 0, position[1]]} scale={textSize}>
      <Pedestal scale={0.5} color={stoneColor} />
      <animated.group position-y={yPosition} scale={scale} visible={active}>
        <mesh ref={subtitleMeshRef}>
          <ElevateText text={text} textSize={textSize} />
        </mesh>
      </animated.group>
    </group>
  );
}

export default function MemorialStones({ subtitles, animator }: MemorialStonesProps) {
  const stoneInfoList = useMemo(() => {
    return calculateMemorialStonePosition(subtitles);
  }, []);

  return (
    <>
      {stoneInfoList.map((stoneInfo, i) => {
        const { subtitle, stonePosition } = stoneInfo;
        const key = `${subtitle}+${i}`;
        return <MemorialStone subTitle={subtitle} position={stonePosition} animator={animator} key={key} />;
      })}
    </>
  );
}

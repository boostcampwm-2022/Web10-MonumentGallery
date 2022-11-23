import { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useBillboard } from "../../hooks/useBillboard";
import { IGalleryPageSubTitle } from "../../@types/gallery";
import MapoFont from "../../assets/MapoFlowerIsland.otf";
import { Object3D } from "three";

interface MemorialStonesProps {
  subtitles: IGalleryPageSubTitle[];
  position: number[];
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

function textPreProcessing(text: string) {
  const letters = text.split("");
  let visibleLetters: string[] = [];
  let invisibleLetters: string[] = [];
  if (letters.length > 20) {
    visibleLetters = letters.slice(0, 20);
    invisibleLetters = letters.slice(20);
  } else {
    visibleLetters = letters;
  }
  return { visibleLetters, invisibleLetters };
}

function MemorialStone({ subTitle, position }: MemorialStoneProps) {
  const { text } = subTitle;
  const [pText, setPText] = useState("");

  const { visibleLetters, invisibleLetters } = useMemo(() => {
    const { visibleLetters, invisibleLetters } = textPreProcessing(text);
    setPText(visibleLetters.join(" "));
    return { visibleLetters, invisibleLetters };
  }, []);

  const subtitleMeshRef = useBillboard<THREE.Mesh>({ lockElevation: true });
  const subtitleRef = useRef<Object3D>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!subtitleRef.current) return;
      subtitleRef.current.position.y -= 1;
      if (subtitleRef.current.position.y < 0) {
        if (invisibleLetters.length > 0) {
          const letter = visibleLetters.pop();
          if (letter) {
            invisibleLetters.push(letter);
          }
          const newLetter = invisibleLetters.shift();
          if (newLetter) {
            visibleLetters.unshift(newLetter);
          }
        } else {
          const letter = visibleLetters.pop();
          if (letter) {
            visibleLetters.unshift(letter);
          }
        }
        setPText(visibleLetters.join(" "));
        subtitleRef.current.position.y = 0;
      }
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <mesh ref={subtitleMeshRef} position-x={position[0]} position-y={2} position-z={position[1]}>
        <Text
          ref={subtitleRef}
          font={MapoFont}
          fontSize={0.5}
          color={"black"}
          maxWidth={0.1}
          textAlign={"center"}
          lineHeight={1}
        >
          {pText}
        </Text>
      </mesh>
      <mesh castShadow position={[position[0], 0, position[1]]} scale-y={1}>
        <boxGeometry />
        <meshLambertMaterial color="#F2D6A2" />
      </mesh>
    </>
  );
}

export default function MemorialStones({ subtitles, position }: MemorialStonesProps) {
  const stoneInfoList = useMemo(() => {
    return calculateMemorialStonePosition(subtitles);
  }, []);
  return (
    <>
      {stoneInfoList.map((stoneInfo, i) => {
        const { subtitle, stonePosition } = stoneInfo;
        const key = `${subtitle}+${i}`;
        return (
          <MemorialStone
            subTitle={subtitle}
            position={position.map((e: number, i: number) => e + stonePosition[i])}
            key={key}
          />
        );
      })}
    </>
  );
}

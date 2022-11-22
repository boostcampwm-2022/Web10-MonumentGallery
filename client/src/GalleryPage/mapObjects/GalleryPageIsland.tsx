import { useMemo } from "react";
import { IGalleryPageData, IGalleryPageSubTitle } from "../../@types/gallery";
import Island from "./Island";
import React, { useMemo, useRef, useState } from "react";
import { animated, Interpolation, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import Balloon from "./Balloon";
import { generateRandomPastelColors } from "../../utils/random";
import MemorialStone from "./MemorialStone";
import { COLORS } from "../../@types/colors";

interface AnimatedTitleProps {
  position: [x: number, y: number, z: number];
  text: string;
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

function AnimatedTitle({ position, text }: AnimatedTitleProps) {
  const [active, setActive] = useState(0);
  const [action, setAction] = useState(false);
  const { camera } = useThree();
  const textGroupRef = useRef<THREE.Group>(null);

  const { spring } = useSpring({
    spring: active,
    config: { tension: 500, friction: 150, precision: 0.04 },
    onStart: () => setAction(true),
    onRest: () => setAction(false),
  });

  const textScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 4]), []);
  const balloonScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);
  const textY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 6]), []);
  const balloonY: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-2, 8]), []);
  const randomColors = useMemo(() => generateRandomPastelColors()[0], []);
  const color: Interpolation<number, COLORS> = spring.to([0, 1], [COLORS.SKY400, COLORS[randomColors]]);
  const rotation = spring.to([0, 1], [0, Math.PI * 4]);

  useFrame(() => {
    if (!action) textGroupRef.current?.lookAt(camera.position);
    const { x, z: y } = camera.position;

    const distance = Math.abs(x - position[0]) + Math.abs(y - position[2]);

    if (distance < 15) {
      if (!active) setActive(+!active);
    } else {
      if (active) setActive(+!active);
    }
  });

  return (
    <>
      <animated.group ref={textGroupRef} position={position} position-y={textY}>
        <animated.mesh rotation-y={rotation} scale={textScale} onClick={() => setActive(+!active)}>
          <Text
            visible={!(!active && !action)}
            font={MapoFlowerIsland}
            color="black"
            fontSize={0.1}
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </animated.mesh>
      </animated.group>
      <Balloon position={position} positionY={balloonY} scale={balloonScale} color={color} />
    </>
  );
}

export default function GalleryPageIsland({ position, subtitle, title }: IGalleryPageData) {
  const [x, z] = position;
  const stoneInfoList = useMemo(() => {
    return calculateMemorialStonePosition(subtitle);
  }, []);
    
  return (
    <>
      <AnimatedTitle position={[x, 0, z]} text={title} />
      <Island x={x} z={z} />
      {stoneInfoList.map((stoneInfo, i) => {
        const { subtitle, stonePosition } = stoneInfo;
        const key = `${subtitle}+${i}`;
        return <MemorialStone subTitle={subtitle} position={position.map((e, i) => e + stonePosition[i])} key={key} />;
      })}
    </>
  );
}

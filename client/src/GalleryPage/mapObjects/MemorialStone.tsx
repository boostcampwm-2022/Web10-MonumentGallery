import { Text } from "@react-three/drei";
import { useEffect, useState } from "react";
import { IGalleryPageSubTitle } from "../../@types/gallery";
import MapoFont from "../../assets/MapoFlowerIsland.otf";
interface MemorialStoneProps {
  subTitle: IGalleryPageSubTitle;
  parentPosition: number[];
  position: number[];
}

export default function MemorialStone({ subTitle, parentPosition, position }: MemorialStoneProps) {
  const { text, type } = subTitle;
  return (
    <>
      <mesh position-x={parentPosition[0] + position[0]} position-z={parentPosition[1] + position[1]}>
        <boxGeometry />
        <meshStandardMaterial color="#F2D6A2" />
      </mesh>
      <Text
        position-x={parentPosition[0] + position[0]}
        position-y={2}
        position-z={parentPosition[1] + position[1]}
        font={MapoFont}
        fontSize={0.1}
        color={"black"}
        maxWidth={0.1}
        textAlign={"center"}
      >
        {text}
      </Text>
    </>
  );
}

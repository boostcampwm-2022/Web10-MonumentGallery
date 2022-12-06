import { Text } from "@react-three/drei";
import Monolith from "./Monolith";
import TextRing from "./TextRing";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import { Portal } from "./Portal";
import { useMemo, useState } from "react";
import { Euler } from "@react-three/fiber";
import { Vector3Arr } from "../../@types/common";
import { IMainDataResponse } from "../../@types/main";
import Delayed from "../../components/Delayed/Delayed";

interface MonumentData {
  userName: string;
  titles: string[];
  galleryURL: string;
}
interface MonumentProps {
  data: MonumentData;
  position: Vector3Arr;
}

export function Monument({ data, position }: MonumentProps) {
  const { userName, titles, galleryURL } = data;
  const [textRingVisible, setTextRingVisible] = useState(false);
  return (
    <group scale={[0.7, 0.7, 0.7]} position={position}>
      <Text position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
        {userName}
      </Text>
      <Monolith rotation={[0, Math.PI / 4, 0]} />
      {textRingVisible &&
        titles.map((title, i) => (
          <Delayed key={title + i} waitBeforeShow={i * 200 + 100}>
            <TextRing text={title} position={[0, 1 + i, 0]} scale={[0.7 - 0.1 * i, 0.7 - 0.1 * i, 0.7 - 0.1 * i]} />
          </Delayed>
        ))}
      <Portal link={galleryURL} position={[1, 0.2, 1]} setTextRingVisible={setTextRingVisible} />
    </group>
  );
}

export function Monuments({
  data,
  gridPosition,
  positions,
}: {
  data: IMainDataResponse | null;
  gridPosition: number[] | null;
  positions: [number, number][] | null;
}) {
  if (!data || !gridPosition || !positions) return null;
  return (
    <>
      {positions.map(([positionX, positionZ], i) => (
        <Delayed key={JSON.stringify([positionX, 0, positionZ])} waitBeforeShow={i * 200 + 100}>
          <Monument position={[gridPosition[0] + positionX, 0, gridPosition[1] + positionZ]} data={data[i]} />
        </Delayed>
      ))}
    </>
  );
}

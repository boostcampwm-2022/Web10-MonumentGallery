import { useState } from "react";
import { Text } from "@react-three/drei";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

import Monolith from "./Monolith";
import WordCloud from "./WordCloud";
import Portal from "./Portal";
import Delayed from "../../components/Delayed/Delayed";

import useTriggeredSpring from "../../hooks/useTriggeredSpring";

import type { Vector3Arr } from "../../@types/common";
import type { IMainDataResponse, IPreviewGalleryData } from "../../@types/main";

import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

interface MonumentData {
  userName: string;
  keywords: string[];
  galleryURL: string;
}
interface MonumentProps {
  data: MonumentData;
  position: Vector3Arr;
}

export function Monument({ data, position }: MonumentProps) {
  const { userName, keywords, galleryURL } = data;
  const [collision, setCollision] = useState(false);
  const springs = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });

  return (
    <RigidBody type="fixed" colliders={false} rotation-y={Math.PI / 4} scale={0.7} position={position}>
      <CylinderCollider
        args={[2, 4]}
        sensor
        onIntersectionEnter={() => setCollision(true)}
        onIntersectionExit={() => setCollision(false)}
      />
      <Text position={[0, 7, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
        {userName}
      </Text>
      <Monolith />
      <WordCloud keywords={keywords} radius={4} position-y={4} animator={springs} />
      <Portal link={galleryURL} position={[0, 0.2, 3]} animator={springs} collision={collision} />
    </RigidBody>
  );
}

export function Monuments({
  gallery,
  gridPosition,
  positions,
}: {
  gallery: IPreviewGalleryData[] | null;
  gridPosition: number[] | null;
  positions: [number, number][] | null;
}) {
  if (!gallery || !gridPosition || !positions) return null;
  return (
    <>
      {positions.map(([positionX, positionZ], i) => (
        <Delayed key={`${positionX}_${positionZ}`} waitBeforeShow={i * 200 + 100}>
          <Monument position={[gridPosition[0] + positionX, 0, gridPosition[1] + positionZ]} data={gallery[i]} />
        </Delayed>
      ))}
    </>
  );
}

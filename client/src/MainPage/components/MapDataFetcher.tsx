import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { Vector2 } from "three";
import mainStore from "../../store/main.store";
import { Monuments } from "../mapObjects/Monument";

export default function MapDataFetcher() {
  const { camera } = useThree();
  const setData = mainStore((store) => store.setData);
  const getData = mainStore((store) => store.getData);
  const [positionKey, setPositionKey] = useState(JSON.stringify([-1, -1]));
  const data = getData(positionKey);

  function calculateGridPosition(position: number[]) {
    return JSON.stringify([Math.floor((position[0] - 25) / 50), Math.floor((position[1] - 25) / 50)]);
  }

  useFrame(({ clock }) => {
    const timer = clock.getElapsedTime();
    if (Math.floor(timer * 1000) % 10 === 0) {
      const playerPosition = [camera.position.x, camera.position.z - 10];
      const newPositionKey = calculateGridPosition(playerPosition);
      if (positionKey !== newPositionKey) {
        setPositionKey(newPositionKey);
      }
    }
  });

  return <Monuments data={data} position={JSON.parse(positionKey).map((e: number) => Math.floor((e + 1) * 50))} />;
}

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import mainStore from "../../store/main.store";
import { generateRandomPosition } from "../../utils/random";
import { Monuments } from "../mapObjects/Monument";

export default function MapDataFetcher() {
  const { camera } = useThree();
  const setGrid = mainStore((store) => store.setGrid);
  const grid = mainStore((store) => store.grid);
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
        console.log(grid);
        setPositionKey(newPositionKey);
        const positions = generateRandomPosition("monument", data.length);
        if (grid[newPositionKey]) return;
        setGrid(data, newPositionKey, positions);
      }
    }
  });

  useEffect(() => {
    if (positionKey === "[-1,-1]") {
      if (grid[positionKey].data.length !== 0) return;
      setGrid(data, positionKey, generateRandomPosition("monument", data.length));
    }
  }, [data]);

  return (
    <>
      <Monuments
        data={grid[positionKey].data}
        gridPosition={JSON.parse(positionKey).map((e: number) => Math.floor((e + 1) * 50))}
        positions={grid[positionKey].positions}
      />
    </>
  );
}

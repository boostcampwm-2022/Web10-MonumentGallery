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

  function getNearByPositionKeys() {
    const position = JSON.parse(positionKey);
    const [x, z] = position;
    const nearByPositions = [
      [x, z],
      [x - 1, z - 1],
      [x - 1, z + 1],
      [x + 1, z + 1],
      [x + 1, z - 1],
      [x - 1, z],
      [x + 1, z],
      [x, z - 1],
      [x, z + 1],
    ];
    return nearByPositions.map((position) => JSON.stringify(position));
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
      if (grid[positionKey]) return;
      setGrid(data, positionKey, generateRandomPosition("monument", data.length));
    }
  }, [data]);

  return (
    <>
      {getNearByPositionKeys().map((pkey) => (
        <Monuments
          key={pkey}
          data={grid[pkey]?.data}
          gridPosition={JSON.parse(pkey).map((e: number) => Math.floor((e + 1) * 50))}
          positions={grid[pkey]?.positions}
        />
      ))}
    </>
  );
}
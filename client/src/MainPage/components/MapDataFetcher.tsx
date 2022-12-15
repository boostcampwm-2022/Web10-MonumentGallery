import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Monuments } from "../mapObjects/Monument";
import mainStore from "../../store/main.store";
import { generateRandomPosition } from "../../utils/random";
import { MAIN_CAMERA_Z } from "../../constants/positions";

export default function MapDataFetcher() {
  const [getData, grid, setGrid, search, setSearch] = mainStore((store) => [
    store.getData,
    store.grid,
    store.setGrid,
    store.search,
    store.setSearch,
  ]);
  const [positionKey, setPositionKey] = useState("[-1,-1]");
  const data = getData(positionKey, search);

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

  useFrame(({ clock, camera }) => {
    const timer = clock.getElapsedTime();
    if (Math.floor(timer * 1000) % 10 === 0) {
      const playerPosition = [camera.position.x, camera.position.z - MAIN_CAMERA_Z];
      const newPositionKey = calculateGridPosition(playerPosition);
      if (positionKey !== newPositionKey) {
        setPositionKey(newPositionKey);
        const positions = generateRandomPosition("monument", data.gallery.length);
        if (grid[newPositionKey]) return;
        setGrid(data.gallery, newPositionKey, positions);
      }
    }
  });

  useEffect(() => {
    setSearch(data.searchState);
    if (positionKey === "[-1,-1]") {
      if (grid[positionKey]) return;
      setGrid(data.gallery, positionKey, generateRandomPosition("monument", data.gallery.length));
    }
  }, [data]);

  return (
    <>
      {getNearByPositionKeys().map((pkey) => (
        <Monuments
          key={pkey}
          gallery={grid[pkey]?.gallery}
          gridPosition={JSON.parse(pkey).map((e: number) => Math.floor((e + 1) * 50))}
          positions={grid[pkey]?.positions}
        />
      ))}
    </>
  );
}

import { Html, Text } from "@react-three/drei";
import Monolith from "./Monolith";
import TextRing from "./TextRing";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import { Portal } from "./Portal";
import { useEffect, useMemo, useState } from "react";
import { Euler } from "@react-three/fiber";
import { generateRandomPosition } from "../../utils/random";
import { Vector3Arr } from "../../@types/common";
import axios from "axios";

interface MonumentData {
  userName: string;
  titles: string[];
  galleryURL: string;
}
interface MonumentProps {
  data: MonumentData;
  position: Vector3Arr;
}

const MockMonumentData = {
  userName: "고세연",
  titles: ["WebProgramming", "HTML", "CSS"],
  galleryURL: "https://monumentgallery.ddns.net/gallery/2d3eef7f-c882-4097-ad72-05eed3a0c037/638da02ca04e896209e0e8b2",
};

export function Monument({ data, position }: MonumentProps) {
  const { userName, titles, galleryURL } = data;
  const rotation = useMemo<Euler>(() => [0, -Math.PI / 2 + Math.random() * (Math.PI / 2), 0], []);

  return (
    <group rotation={rotation} scale={[0.7, 0.7, 0.7]} position={position}>
      <Text position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
        {userName}
      </Text>
      <Monolith rotation={[0, Math.PI / 4, 0]} />
      {titles.map((title, i) => (
        <TextRing
          key={title + i}
          text={title}
          position={[0, 1 + i, 0]}
          scale={[0.7 - 0.1 * i, 0.7 - 0.1 * i, 0.7 - 0.1 * i]}
        />
      ))}
      <Portal link={galleryURL} position={[1, 0.2, 1]} />
    </group>
  );
}

export function Monuments() {
  const positions = useMemo(() => generateRandomPosition("monument", 15), []);

  return (
    <>
      {positions.map(([positionX, positionZ]) => (
        <Monument
          key={JSON.stringify([positionX, 0, positionZ])}
          position={[positionX, 0, positionZ]}
          data={MockMonumentData}
        />
      ))}
    </>
  );
}

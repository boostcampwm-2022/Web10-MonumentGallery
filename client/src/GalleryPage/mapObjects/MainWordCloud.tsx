import { useMemo } from "react";
import { Text, Billboard } from "@react-three/drei";
import { Vector3, Quaternion } from "three";

import { IKeywordMap } from "../../@types/gallery";

import MapoFont from "../../assets/MapoFlowerIsland.otf";

interface IWordPointData {
  text: string;
  size: number;
  fontSize: number;
}

interface IOrbitData {
  children: IWordPointData[];
  radius: number;
  spiralCount: number;
}

interface WordObjectProps {
  data: IWordPointData;
  position: Vector3 | [x: number, y: number, z: number];
}

interface WordHelixProps {
  orbitData: IOrbitData;
}

interface MainWordCloudProps {
  keywords: IKeywordMap;
}

function makeWordsPointData(words: IKeywordMap): IWordPointData[] {
  const entries = Object.entries(words);
  const biggestFrequency = entries.reduce((max, [, value]) => Math.max(max, value), 0);
  const biggestfontSize = 1;
  const result = [];
  for (const [text, freq] of entries) {
    const fontSize = (biggestfontSize * freq) / biggestFrequency;
    const size = (text.length * freq) / 8;
    result.push({ text, size, fontSize });
  }
  result.sort((a, b) => b.size - a.size);
  return result.slice(0, 30);
}

function seperateWordToOrbits(wordData: IWordPointData[]): IOrbitData[] {
  if (wordData.length === 0) return [];

  const result = [{ children: [wordData[0]], radius: wordData[0].size, spiralCount: 0 }];

  let prevOrbitIndex = 0;
  let index = 1;

  while (index < wordData.length) {
    const currentWordData = wordData[index];

    const radius = result[prevOrbitIndex].radius + currentWordData.size;
    const spiralCount = Math.floor((1.28 * radius) / currentWordData.size / 2) * 2;
    const maxSpiralLength = radius * spiralCount * 2;
    const maxChildrenCount = Math.floor((spiralCount * spiralCount) / 0.64);

    const children = [];
    let spiralLength = 0;
    let childrenCount = 0;
    while (spiralLength < maxSpiralLength && childrenCount <= maxChildrenCount && index < wordData.length) {
      const currentWordData = wordData[index];

      children.push(currentWordData);
      spiralLength += currentWordData.size;
      index++;
      childrenCount++;
    }
    if (children.length > 0) {
      result.push({ children, radius, spiralCount });
      prevOrbitIndex++;
    }
  }
  return result;
}

function getHelicalPosition(radius: number, index: number, spiralCount: number) {
  const toCostanter = (x: number, slope: number) => {
    return (((x - 0.5) ** 3 + slope * (x - 0.5)) * Math.PI * 4) / (1 + slope * 4) + Math.PI / 2;
  };

  const theta = toCostanter(index, 0.4);
  const phi = theta * spiralCount * 2;

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta);
  const z = Math.sin(theta) * Math.sin(phi);
  return new Vector3(x, y, z).multiplyScalar(radius);
}

function getDistributeIndex(index: number) {
  if (index === 0) return 0;
  if (index === 1) return 1;
  if (index === 2) return 0.5;
  const _index = index - 1;
  const logIndex = Math.floor(Math.log2(_index));
  const min2PowIndex = 2 ** logIndex;

  const result = (_index - min2PowIndex) / min2PowIndex + 1 / (min2PowIndex * 2);

  if (logIndex % 2) return result;
  return 1 - result;
}

function WordObject({ data, position }: WordObjectProps) {
  const { text, fontSize } = data;
  return (
    <Billboard position={position}>
      <Text font={MapoFont} fontSize={fontSize} color="black" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </Billboard>
  );
}

function WordHelix({ orbitData }: WordHelixProps) {
  const { children, radius, spiralCount } = orbitData;
  const rotation = new Quaternion().random();

  const toRenderChildren = useMemo<IWordPointData[]>(
    () =>
      children
        .map((value, index) => ({ value, index }))
        .sort((a, b) => getDistributeIndex(b.index) - getDistributeIndex(a.index))
        .map(({ value }) => value),
    [children],
  );

  return (
    <>
      {toRenderChildren.map((child: IWordPointData, i: number) => {
        const partician = toRenderChildren.length < 2 ? 0 : i / (toRenderChildren.length - 1);
        const position = getHelicalPosition(radius, partician, spiralCount);
        position.add(new Vector3().randomDirection().multiplyScalar(0.5));
        position.applyQuaternion(rotation);
        return <WordObject data={child} position={position} key={`${child.text}_${i}`} />;
      })}
    </>
  );
}

export default function MainWordCloud({ keywords, ...props }: MainWordCloudProps) {
  const [firstOrbit, ...helixOrbits] = useMemo<IOrbitData[]>(() => {
    const wordData = makeWordsPointData(keywords);
    return seperateWordToOrbits(wordData);
  }, []);

  if (firstOrbit == null) return <group {...props} />;
  return (
    <group {...props}>
      <WordObject data={firstOrbit.children[0]} position={[0, 0, 0]} />
      {helixOrbits.map((orbit: IOrbitData, i: number) => (
        <WordHelix orbitData={orbit} key={`orbit_${i}`} />
      ))}
    </group>
  );
}

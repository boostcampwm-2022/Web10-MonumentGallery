import { useRef, useMemo } from "react";
import { Vector3, Quaternion, Group } from "three";
import { useFrame, GroupProps } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";

import { useBillboard } from "../../hooks/useBillboard";
import { IWordPointData, makeWordsPointData, getDistributeIndex } from "../../utils/wordCloudUtils";

import { Vector3Arr } from "../../@types/common";
import { IKeywordMap } from "../../@types/gallery";

import MapoFont from "../../assets/MapoFlowerIsland.otf";

interface WordObjectProps {
  data: IWordPointData;
  position: Vector3 | Vector3Arr;
}

interface IOrbitData {
  children: IWordPointData[];
  radius: number;
  spiralCount: number;
}

interface WordHelixProps {
  orbitData: IOrbitData;
}

interface MainWordCloudProps extends GroupProps {
  keywords: IKeywordMap;
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

function WordObject({ data, position }: WordObjectProps) {
  const { text, fontSize } = data;
  const objectRef = useBillboard();
  return (
    <Float speed={3}>
      <Text
        font={MapoFont}
        fontSize={fontSize}
        color="black"
        anchorX="center"
        anchorY="middle"
        position={position}
        ref={objectRef}
      >
        {text}
      </Text>
    </Float>
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
  const objectRef = useRef<Group>(null);

  const [firstOrbit, ...helixOrbits] = useMemo<IOrbitData[]>(() => {
    const wordData = makeWordsPointData(keywords);
    wordData.forEach((word) => {
      word.size *= 5;
    });
    return seperateWordToOrbits(wordData);
  }, [keywords]);

  useFrame((_, delta) => {
    if (!objectRef.current) return;
    objectRef.current.rotation.y += 0.2 * delta;
    objectRef.current.rotation.x += 0.1 * delta;
  });

  if (firstOrbit == null) return <group rotation-order="YXZ" {...props} />;
  return (
    <group rotation-order="YXZ" {...props} ref={objectRef}>
      <WordObject data={firstOrbit.children[0]} position={[0, 0, 0]} />
      {helixOrbits.map((orbit: IOrbitData, i: number) => (
        <WordHelix orbitData={orbit} key={`orbit_${i}`} />
      ))}
    </group>
  );
}

import { useState, useRef, useMemo } from "react";
import { Vector3, Quaternion, Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { BallCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { animated, Interpolation } from "@react-spring/three";

import { useBillboard } from "../../hooks/useBillboard";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
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

interface MainWordCloudProps extends RigidBodyProps {
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

  const toRenderChildren = useMemo<WordObjectProps[]>(() => {
    const getPartician = (i: number) => (children.length < 2 ? 0 : i / (children.length - 1));

    return children
      .map((data, index) => ({ data, index }))
      .sort((a, b) => getDistributeIndex(b.index) - getDistributeIndex(a.index))
      .map(({ data }, i) => {
        const position = getHelicalPosition(radius, getPartician(i), spiralCount);
        position.add(new Vector3().randomDirection().multiplyScalar(0.5));
        position.applyQuaternion(rotation);
        return { data, position };
      });
  }, [children]);

  return (
    <>
      {toRenderChildren.map(({ data, position }: WordObjectProps, i: number) => {
        return <WordObject data={data} position={position} key={`${data.text}_${i}`} />;
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

  const [collision, setCollision] = useState(false);
  const { spring } = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const scale: Interpolation<number, number> = useMemo(() => spring.to([0, 0.5, 1], [0, 0.25, 0.8]), []);
  const yPosition: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [4, 8]), []);

  if (firstOrbit == null) return null;
  return (
    <RigidBody type="fixed" colliders={false} {...props}>
      <BallCollider
        args={[9]}
        sensor
        onIntersectionEnter={() => setCollision(true)}
        onIntersectionExit={() => setCollision(false)}
      />
      <animated.group rotation-order="YXZ" scale={scale} position-y={yPosition} ref={objectRef}>
        <WordObject data={firstOrbit.children[0]} position={[0, 0, 0]} />
        {helixOrbits.map((orbit: IOrbitData, i: number) => (
          <WordHelix orbitData={orbit} key={`orbit_${i}`} />
        ))}
      </animated.group>
    </RigidBody>
  );
}

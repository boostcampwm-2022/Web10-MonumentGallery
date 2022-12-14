import { useRef, useMemo } from "react";
import { Vector3, Quaternion, Euler, Group } from "three";
import { useFrame, GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";

import { IWordPointData, makeWordsPointData, getCircluarDistributeIndex } from "../../utils/wordCloudUtils";

import type { Vector3Arr } from "../../@types/common";
import type { ITriggeredSpringState } from "../../@types/animator";
import type { IKeywordMap } from "../../@types/gallery";

import MapoFont from "../../assets/fonts/MapoFlowerIsland.otf";

interface WordObjectProps {
  data: IWordPointData;
  position: Vector3 | Vector3Arr;
  quaternion: Quaternion;
}

interface IOrbitData {
  children: IWordPointData[];
  y: number;
  height: number;
}

interface WordHelixProps extends GroupProps {
  orbitData: IOrbitData;
  radius: number;
}

interface SubWordCloudProps extends GroupProps {
  keywords: IKeywordMap;
  radius: number;
  animator: ITriggeredSpringState;
}

// temporary buffer
const _vector3 = new Vector3();
const _quaternion = new Quaternion();
const _euler = new Euler();

// WordPointData의 목록을 서로 다른 원으로 나눕니다.
function seperateWordToOrbits(wordData: IWordPointData[], circumference: number): IOrbitData[] {
  if (wordData.length === 0) return [];

  const result = [];

  let index = 0;
  let upperY = 0;
  let lowerY = 0;
  while (index < wordData.length) {
    const currentWordData = wordData[index];

    const children = [currentWordData];
    let spiralLength = currentWordData.size;
    const height = currentWordData.fontSize;
    index++;

    let y = 0;
    if (result.length) y = result.length % 2 ? upperY + height / 2 : lowerY - height / 2;
    while (index < wordData.length && spiralLength + currentWordData.size < circumference) {
      const currentWordData = wordData[index];

      children.push(currentWordData);
      spiralLength += currentWordData.size;
      index++;
    }
    if (children.length > 0) {
      result.push({ children, y, height });
      upperY = Math.max(upperY, y + height / 2);
      lowerY = Math.min(lowerY, y - height / 2);
    }
  }
  return result;
}

// 반지름과 원주상 위치, y좌표를 받아 좌표를 반환합니다.
function getCylinderPosition(radius: number, partician: number, y: number) {
  const angle = partician * Math.PI * 2;
  return new Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
}

interface IAccumulator {
  arr: number[];
  max: number;
}

// 각 포인터 데이터에 대해 원주상 비례 위치를 반환합니다.
function makeChildrenPartician(children: IWordPointData[]) {
  const { arr, max } = children.reduce(
    ({ arr, max }: IAccumulator, { size }: IWordPointData, i: number) => {
      if (i === 0) return { arr: [size / 2], max: size };
      const newMax = max + size;
      arr.push(newMax - size / 2);
      return { arr, max: newMax };
    },
    { arr: [], max: 0 },
  );
  return arr.map((value) => value / max);
}

// 텍스트를 원 안쪽을 바라보도록 만드는 벡터를 만듭니다.
function getTextRotation(position: Vector3) {
  _vector3.copy(position);
  _vector3.y = 0;
  _vector3.normalize();
  const quaternion = _quaternion.setFromUnitVectors(new Vector3(1, 0, 0), _vector3);
  const euler = _euler.setFromQuaternion(quaternion, "YXZ");
  euler.y -= Math.PI / 2;
  return new Quaternion().setFromEuler(euler);
}

// 각 텍스트 오브젝트입니다.
function WordObject({ data, ...props }: WordObjectProps) {
  const { text, fontSize } = data;
  return (
    <Text font={MapoFont} fontSize={fontSize} color="black" anchorX="center" anchorY="middle" {...props}>
      {text}
    </Text>
  );
}

// 각 텍스트 원통 집합 컴포넌트입니다.
function WordHelix({ orbitData, radius, scale }: WordHelixProps) {
  const { children, y, height } = orbitData;

  const toRenderChildren = useMemo<WordObjectProps[]>(() => {
    const _children = children
      .map((value, index) => ({ value, index }))
      .sort((a, b) => getCircluarDistributeIndex(b.index) - getCircluarDistributeIndex(a.index))
      .map(({ value }) => value);
    const particians = makeChildrenPartician(_children);
    return _children.map((data, i) => {
      const partician = particians[i];
      const yZitter = (Math.random() - 0.5) * height;
      const position = getCylinderPosition(radius, partician, y + yZitter);
      const quaternion = getTextRotation(position);

      return { data, position, quaternion };
    });
  }, [children]);

  return (
    <group scale={scale}>
      {toRenderChildren.map(({ data, position, quaternion }: WordObjectProps, i: number) => {
        const key = `${data.text}_${i}`;
        return <WordObject data={data} position={position} quaternion={quaternion} key={key} />;
      })}
    </group>
  );
}

// 원통형 워드클라우드 컴포넌트입니다.
export default function SubWordCloud({ keywords, radius, animator, ...props }: SubWordCloudProps) {
  const objectRef = useRef<Group>(null);
  const { spring, active } = animator;

  const orbits = useMemo<IOrbitData[]>(() => {
    const wordData = makeWordsPointData(keywords);
    return seperateWordToOrbits(wordData, radius);
  }, [keywords, radius]);

  const yPosition: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [-1, 2]), []);
  const scale: Interpolation<number, number> = useMemo(() => spring.to([0, 0.3, 1], [0, 0, 1]), []);

  useFrame((_, delta) => {
    if (!objectRef.current) return;
    objectRef.current.rotation.y += 0.2 * delta;
  });

  return (
    <animated.group
      rotation-order="YXZ"
      visible={active}
      position-y={yPosition}
      {...props}
      scale={scale}
      ref={objectRef}
    >
      {orbits.map((orbit: IOrbitData, i: number) => (
        <WordHelix orbitData={orbit} radius={radius} scale={props.scale} key={`orbit_${i}`} />
      ))}
    </animated.group>
  );
}

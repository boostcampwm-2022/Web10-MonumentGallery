import { useRef, useMemo } from "react";
import { Vector3, Group } from "three";
import { useFrame, GroupProps } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";

import { useBillboard } from "../../hooks/useBillboard";

import type { Vector3Arr } from "../../@types/common";
import type { ITriggeredSpringState } from "../../@types/animator";

import MapoFont from "../../assets/MapoFlowerIsland.otf";

interface WordObjectProps {
  text: string;
  fontSize: number;
  position: Vector3 | Vector3Arr;
}

interface WordCloudProps extends GroupProps {
  keywords: string[];
  radius: number;
  animator: ITriggeredSpringState;
}

function WordObject({ text, fontSize, position }: WordObjectProps) {
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

export default function WordCloud({ keywords, radius, animator, ...props }: WordCloudProps) {
  const objectRef = useRef<Group>(null);
  const { spring, active } = animator;
  const scale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0, 1]), []);

  const wordData: WordObjectProps[] = useMemo(() => {
    const count = keywords.length;
    return keywords.map((text: string, i: number) => {
      const fontSize = (count - i) / count;
      const position = new Vector3().randomDirection();
      position.multiplyScalar(radius * (Math.random() * 0.1 + 0.95));
      return { text, fontSize, position };
    });
  }, [keywords, radius]);

  useFrame((_, delta) => {
    if (!objectRef.current) return;
    objectRef.current.rotation.y += 0.2 * delta;
  });

  return (
    <animated.group ref={objectRef} scale={scale} visible={active} {...props}>
      {wordData.map((props: WordObjectProps, i: number) => (
        <WordObject key={`${props.text}_${i}`} {...props} />
      ))}
    </animated.group>
  );
}

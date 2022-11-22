import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { IGalleryPageSubTitle } from "../../@types/gallery";
import MapoFont from "../../assets/MapoFlowerIsland.otf";
interface MemorialStoneProps {
  subTitle: IGalleryPageSubTitle;
  position: number[];
}

function textPreProcessing(text: string) {
  const letters = text.split("");
  let visibleLetters: string[] = [];
  let invisibleLetters: string[] = [];
  if (letters.length > 20) {
    visibleLetters = letters.slice(0, 20);
    invisibleLetters = letters.slice(20);
  } else {
    visibleLetters = letters;
  }
  return { visibleLetters, invisibleLetters };
}

export default function MemorialStone({ subTitle, position }: MemorialStoneProps) {
  const { text, type } = subTitle;
  const [pText, setPText] = useState("");
  const { camera } = useThree();

  const { visibleLetters, invisibleLetters } = useMemo(() => {
    const { visibleLetters, invisibleLetters } = textPreProcessing(text);
    setPText(visibleLetters.join(" "));
    return { visibleLetters, invisibleLetters };
  }, []);

  const subtitleMeshRef = useRef<THREE.Mesh>(null);
  const subtitleRef = useRef<any>();

  useFrame(() => {
    subtitleMeshRef.current?.lookAt(new Vector3(camera.position.x, 2, camera.position.z));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      subtitleRef.current.position.y -= 1;
      if (subtitleRef.current.position.y < 0) {
        if (invisibleLetters.length > 0) {
          const letter = visibleLetters.pop();
          if (letter) {
            invisibleLetters.push(letter);
          }
          const newLetter = invisibleLetters.shift();
          if (newLetter) {
            visibleLetters.unshift(newLetter);
          }
        } else {
          const letter = visibleLetters.pop();
          if (letter) {
            visibleLetters.unshift(letter);
          }
        }
        setPText(visibleLetters.join(" "));
        subtitleRef.current.position.y = 0;
      }
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <mesh position={[position[0], 0, position[1]]} scale-y={1}>
        <boxGeometry />
        <meshStandardMaterial color="#F2D6A2" />
      </mesh>
      <mesh ref={subtitleMeshRef} position-x={position[0]} position-y={2} position-z={position[1]}>
        <Text
          ref={subtitleRef}
          font={MapoFont}
          fontSize={0.5}
          color={"black"}
          maxWidth={0.1}
          textAlign={"center"}
          lineHeight={1}
        >
          {pText}
        </Text>
      </mesh>
    </>
  );
}

import { Cylinder } from "@react-three/drei";
import { useFrame, Vector2, Vector3 } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function genarateTextCanvas(text: string) {
  const fontSize = 450;

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (context !== null) {
    context.fillStyle = "transparent";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontSize}px MapoFlowerIsland`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    context.fillText(text, 1024, canvas.height / 2);
    return canvas;
  }
}

interface TextRingProps {
  text: string;
  position: Vector3;
  scale: Vector3;
}
export default function TextRing({ text, position, scale }: TextRingProps) {
  const canvas = useMemo(() => {
    return genarateTextCanvas(text);
  }, [text]);

  const texture = useRef<THREE.CanvasTexture>(null!);
  useFrame(({ clock }) => {
    if (texture.current !== undefined) {
      texture.current.offset.x = clock.getElapsedTime() / 5;
    }
  });

  const cylArgs = [3, 3, 3, 64, 1, true];
  return (
    <group position={position} rotation-y={Math.PI / 4} scale={scale}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Cylinder args={cylArgs}>
        <meshStandardMaterial transparent attach="material" side={THREE.FrontSide}>
          <canvasTexture
            attach="map"
            repeat={new THREE.Vector2(4, 1)}
            image={canvas}
            premultiplyAlpha
            ref={texture}
            wrapS={THREE.RepeatWrapping}
            wrapT={THREE.RepeatWrapping}
            onUpdate={(s) => (s.needsUpdate = true)}
          />
        </meshStandardMaterial>
      </Cylinder>
    </group>
  );
}

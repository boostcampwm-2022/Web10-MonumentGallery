import IslandGeometry from "./islandGeometry";
import { Color, extend, BufferGeometryNode } from "@react-three/fiber";

// extend island geometry so that vite parse islandGeometry component
extend({ IslandGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    islandGeometry: BufferGeometryNode<IslandGeometry, typeof IslandGeometry>;
  }
}

interface IslandProps {
  x: number;
  z: number;
  islandScale?: number;
  color?: Color;
}

export default function Island({ x, z, islandScale = 5, color = 0x24adaf }: IslandProps) {
  return (
    <mesh position={[x, 0, z]}>
      <islandGeometry args={[islandScale]} />
      <meshStandardMaterial color={color} flatShading={true} />
    </mesh>
  );
}

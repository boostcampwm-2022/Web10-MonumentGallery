import IslandGeometry from "./islandGeometry";
import { Color, extend, BufferGeometryNode, MeshProps } from "@react-three/fiber";

// extend island geometry so that vite parse islandGeometry component
extend({ IslandGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    islandGeometry: BufferGeometryNode<IslandGeometry, typeof IslandGeometry>;
  }
}

interface IslandProps extends MeshProps {
  islandScale?: number;
  color?: Color;
}

export default function Island({ islandScale = 5, color = 0x24adaf, ...props }: IslandProps) {
  return (
    <mesh receiveShadow {...props}>
      <islandGeometry args={[islandScale]} />
      <meshLambertMaterial color={color} flatShading={true} />
    </mesh>
  );
}

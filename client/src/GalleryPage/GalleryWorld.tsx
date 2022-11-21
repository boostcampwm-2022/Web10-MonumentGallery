import Plane from "./components/Plane";
import { IGallaryMapData } from "../@types/common";

interface GalleryWorldProps {
  data: IGallaryMapData;
}

export default function GalleryWorld({ data }: GalleryWorldProps) {
  console.log(data);
  return (
    <>
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

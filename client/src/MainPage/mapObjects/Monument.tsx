import { Text } from "@react-three/drei";
import Monolith from "./Monolith";
import TextRing from "./TextRing";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import MonumentPortal from "./MonumentPortal";

interface MonumentProps {
  userName: string;
  titles: string[];
  galleryUrl: string;
}

export default function Monument({ userName, titles, galleryUrl }: MonumentProps) {
  return (
    <>
      <Text position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
        {userName}
      </Text>
      <Monolith rotation={[0, Math.PI / 4, 0]} />
      {titles[0] && <TextRing text={titles[0]} position={[0, 1, 0]} scale={[0.7, 0.7, 0.7]} />}
      {titles[1] && <TextRing text={titles[1]} position={[0, 2, 0]} scale={[0.6, 0.6, 0.6]} />}
      {titles[2] && <TextRing text={titles[2]} position={[0, 3, 0]} scale={[0.5, 0.5, 0.5]} />}
      <MonumentPortal link={galleryUrl} position={[2, 0.2, 2]} />
      {/* <Portal position={[2, 0, 2]} rotation={[0, Math.PI / 4, 0]} scale={[0.5, 0.5, 0.5]} /> */}
    </>
  );
}

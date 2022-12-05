import { Text } from "@react-three/drei";
import Monolith from "./Monolith";
import TextRing from "./TextRing";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";
import { Portal } from "./Portal";

interface MonumentData {
  userName: string;
  titles: string[];
  galleryURL: string;
}
interface MonumentProps {
  data: MonumentData;
}

export default function Monument({ data }: MonumentProps) {
  const { userName, titles, galleryURL } = data;
  return (
    <>
      <Text position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
        {userName}
      </Text>
      <Monolith rotation={[0, Math.PI / 4, 0]} />
      {titles[0] && <TextRing text={titles[0]} position={[0, 1, 0]} scale={[0.7, 0.7, 0.7]} />}
      {titles[1] && <TextRing text={titles[1]} position={[0, 2, 0]} scale={[0.6, 0.6, 0.6]} />}
      {titles[2] && <TextRing text={titles[2]} position={[0, 3, 0]} scale={[0.5, 0.5, 0.5]} />}
      <Portal link={galleryURL} position={[1, 0.2, 1]} />
    </>
  );
}

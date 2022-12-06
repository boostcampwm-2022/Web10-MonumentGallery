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
      <group scale={[0.7, 0.7, 0.7]}>
        <Text position={[0, 7, 0]} rotation={[0, Math.PI / 4, 0]} font={MapoFlowerIsland} fontSize={0.5} color="black">
          {userName}
        </Text>
        <Monolith rotation={[0, Math.PI / 4, 0]} />
        {titles.map((title, i) => (
          <TextRing
            key={title + i}
            text={title}
            position={[0, 1 + i, 0]}
            scale={[0.7 - 0.1 * i, 0.7 - 0.1 * i, 0.7 - 0.1 * i]}
          />
        ))}
        <Portal link={galleryURL} position={[1, 0.2, 1]} />
      </group>
    </>
  );
}

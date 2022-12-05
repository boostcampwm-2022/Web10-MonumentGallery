import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";
import Monument from "./mapObjects/Monument";
import Plane from "./mapObjects/Plane";

interface MonumentProps {
  userName: string;
  titles: string[];
  galleryUrl: string;
}

export default function MainWorld() {
  return (
    <>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <gridHelper args={[100, 100, 0]} />
        <Monument
          userName={"고세연"}
          titles={["react 정리", "멤버십 과정", "모뉴먼트 갤러리"]}
          galleryUrl={"https://monument"}
        />
        <Plane />
      </Physics>
    </>
  );
}

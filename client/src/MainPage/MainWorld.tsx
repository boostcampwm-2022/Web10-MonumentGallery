import { Physics } from "@react-three/rapier";
import { useRef } from "react";
import TPVMovementController from "./components/TPVMovementController";
import Light from "../GalleryPage/mapObjects/Light";
import Ghost from "./mapObjects/Ghost";
import Monument from "./mapObjects/Monument";
import Plane from "./mapObjects/Plane";

interface MonumentProps {
  userName: string;
  titles: string[];
  galleryUrl: string;
}

export default function MainWorld() {
  const ghostParentRef = useRef<THREE.Group>(null);
  return (
    <>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        {/* <gridHelper args={[100, 100, 0]} /> */}
        <Monument
          userName={"고세연"}
          titles={["react 정리", "멤버십 과정", "모뉴먼트 갤러리"]}
          galleryUrl={
            "https://monumentgallery.ddns.net/gallery/2d3eef7f-c882-4097-ad72-05eed3a0c037/638da02ca04e896209e0e8b2"
          }
        />
        <TPVMovementController speed={10} />
        <group ref={ghostParentRef}>
          <Ghost ghostParent={ghostParentRef.current} />
        </group>
        <Plane />
      </Physics>
    </>
  );
}

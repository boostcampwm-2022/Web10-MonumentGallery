import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";
import Monument from "./mapObjects/Monument";
import Plane from "./mapObjects/Plane";
export default function MainWorld() {
  return (
    <>
      <Physics gravity={[0, -30, 0]}>
        <Light />
        <gridHelper args={[100, 100, 0]} />
        <Monument />
        <Plane />
      </Physics>
    </>
  );
}

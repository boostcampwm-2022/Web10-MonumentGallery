import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";
import { Monuments } from "./mapObjects/Monument";

export default function MainWorld() {
  return (
    <Physics gravity={[0, 0, 0]}>
      <Light />
      <Player />
      <Plane />
      {/* <Monument data={MockMonumentData} /> */}
      <Monuments />
    </Physics>
  );
}

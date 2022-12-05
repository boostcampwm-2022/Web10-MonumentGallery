import { Physics } from "@react-three/rapier";
import Light from "../GalleryPage/mapObjects/Light";

import Player from "./mapObjects/Player";
import Plane from "./mapObjects/Plane";

export default function MainWorld() {
  return (
    <Physics gravity={[0, -30, 0]}>
      <Light />
      <Player />
      <Plane />
    </Physics>
  );
}

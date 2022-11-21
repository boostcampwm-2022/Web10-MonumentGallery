import Light from "./components/Light";
import Plane from "./components/Plane";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";
import galleryStore from "../store/gallery.store";

export default function Gallery() {
  const { data } = galleryStore();
  console.log(data);
  return (
    <>
      <Light />
      <MovementController speed={5} />
      <ViewRotateController />
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

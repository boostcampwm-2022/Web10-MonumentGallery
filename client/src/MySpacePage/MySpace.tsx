import Light from "./components/Light";
import Plane from "./components/Plane";
import MovementController from "./components/MovementController";
import ViewRotateController from "./components/ViewRotateController";

export default function MySpace() {
  console.log("rendered!");
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

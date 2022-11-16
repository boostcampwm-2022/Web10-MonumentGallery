import Controls from "./components/Controls";
import Light from "./components/Light";
import Plane from "./components/Plane";
export default function MySpace() {
  return (
    <>
      <Light />
      <Controls />
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI * 0.25, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <Plane />
    </>
  );
}

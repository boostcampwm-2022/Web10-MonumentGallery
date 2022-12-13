import { useLoader, GroupProps } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import Pedestal from "./Pedestal";
import { useOBJGeometry } from "../../hooks/useObjGeometry";
import MonolithObj from "../../assets/models/monolith.obj?url";

export default function Monolith(props: GroupProps) {
  const monolith = useOBJGeometry(MonolithObj);
  return (
    <group {...props}>
      <Float rotationIntensity={0} speed={5}>
        <mesh castShadow geometry={monolith} position-y={1}>
          <meshLambertMaterial color="#ff4b00" />
        </mesh>
      </Float>
      <Pedestal color="#ff7b00" />
    </group>
  );
}

useLoader.preload(OBJLoader, MonolithObj);

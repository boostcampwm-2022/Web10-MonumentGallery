import { useLoader, GroupProps } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/ObjLoader";
import MonolithObj from "../../assets/models/monolith.obj?url";
import PedestalObj from "../../assets/models/monolith-pedestal.obj?url";

function useOBJ(asset: string) {
  const group = useLoader(OBJLoader, asset);
  const target = Array.isArray(group) ? group[0].children[0] : group.children[0];
  if (target == null) throw new Error("잘못된 obj파일");
  return target.geometry;
}

export default function Monolith(props: GroupProps) {
  const monolith = useOBJ(MonolithObj);
  const pedestal = useOBJ(PedestalObj);
  return (
    <group {...props}>
      <Float rotationIntensity={0} speed={5}>
        <mesh castShadow geometry={monolith} position-y={1}>
          <meshLambertMaterial color="#ff4b00" />
        </mesh>
      </Float>
      <mesh castShadow receiveShadow geometry={pedestal}>
        <meshLambertMaterial color="#ff7b00" />
      </mesh>
    </group>
  );
}

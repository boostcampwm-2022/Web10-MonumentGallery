import { useLoader, useFrame, GroupProps } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/ObjLoader";
import MonolithObj from "../../assets/models/monolith.obj?url";
import PedestalObj from "../../assets/models/monolith-pedestal.obj?url";

function useOBJ(asset) {
  const group = useLoader(OBJLoader, asset);
  return group.children[0].geometry;
}

export default function Monolith(props: GroupProps) {
  const monolith = useOBJ(MonolithObj);
  const pedestal = useOBJ(PedestalObj);
  return (
    <group castShadow {...props}>
      <mesh geometry={monolith} position-y={1}>
        <meshLambertMaterial color="#ff4b00" />
      </mesh>
      <mesh geometry={pedestal}>
        <meshLambertMaterial color="#ff7b00" />
      </mesh>
    </group>
  );
}

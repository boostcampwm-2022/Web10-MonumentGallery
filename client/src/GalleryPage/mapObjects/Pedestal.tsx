import { useLoader, MeshProps, Color } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import PedestalObj from "../../assets/models/monolith-pedestal.obj?url";

interface PedestalProps extends MeshProps {
  color: Color;
}

function useOBJ(asset: string) {
  const group = useLoader(OBJLoader, asset);
  const target = Array.isArray(group) ? group[0].children[0] : group.children[0];
  if (target == null) throw new Error("잘못된 obj파일");
  return target.geometry;
}

export default function Pedestal({ color, ...props }: PedestalProps) {
  const pedestal = useOBJ(PedestalObj);
  return (
    <mesh castShadow receiveShadow geometry={pedestal} {...props}>
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

useLoader.preload(OBJLoader, PedestalObj);

import { useLoader, MeshProps, Color } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import { useOBJGeometry } from "../../hooks/useObjGeometry";
import PedestalObj from "../../assets/models/monolith-pedestal.obj?url";

interface PedestalProps extends MeshProps {
  color: Color;
}

export default function Pedestal({ color, ...props }: PedestalProps) {
  const pedestal = useOBJGeometry(PedestalObj);
  return (
    <mesh castShadow receiveShadow geometry={pedestal} {...props}>
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

useLoader.preload(OBJLoader, PedestalObj);

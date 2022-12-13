import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";

export function useOBJGeometry(asset: string) {
  const group = useLoader(OBJLoader, asset);
  const target = Array.isArray(group) ? group[0].children[0] : group.children[0];
  if (target == null) throw new Error("잘못된 obj파일");
  return target.geometry;
}

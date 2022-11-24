import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import StoneGlb from "../../assets/models/hyperlink-stone.glb?url";

type GLTFResult = GLTF & {
  nodes: {
    lp2_Material_0: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

export default function Stone(props: GroupProps) {
  const { nodes, materials } = useGLTF(StoneGlb) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.lp2_Material_0.geometry} material={materials.Material} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(StoneGlb);

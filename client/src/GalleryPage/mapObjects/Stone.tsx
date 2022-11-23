import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    lp2_Material_0: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

export default function Stone(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/hyperlink-stone.glb") as unknown as GLTFResult;
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

useGLTF.preload("/hyperlink-stone.glb");

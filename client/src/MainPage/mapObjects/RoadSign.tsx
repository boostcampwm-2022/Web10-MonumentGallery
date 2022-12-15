import { useGLTF } from "@react-three/drei";
import roadSignModel from "../../assets/models/road-sign.glb?url";

import type { Mesh, MeshStandardMaterial } from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Object_8001: Mesh;
    Object_1001: Mesh;
    Object_1001_1: Mesh;
  };
  materials: {
    ["iron.002"]: MeshStandardMaterial;
    ["WoodLight.002"]: MeshStandardMaterial;
    매테리얼: MeshStandardMaterial;
  };
};

export default function RoadSign(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(roadSignModel) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.Object_8001.geometry}
        material={materials["iron.002"]}
        position={[0.1, 0.4, 0]}
      />
      <mesh castShadow geometry={nodes.Object_1001.geometry} material={materials["WoodLight.002"]} />
      <mesh castShadow geometry={nodes.Object_1001_1.geometry} material={materials["매테리얼"]} />
      {props.children}
    </group>
  );
}

useGLTF.preload(roadSignModel);

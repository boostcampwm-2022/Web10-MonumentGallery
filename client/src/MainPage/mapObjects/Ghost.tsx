import type { Mesh, MeshStandardMaterial, MeshPhysicalMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { GroupProps } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import GhostGlb from "../../assets/models/monument_ghost.glb?url";

type GLTFResult = GLTF & {
  nodes: {
    mouth: Mesh;
    eye_right: Mesh;
    ring: Mesh;
    body: Mesh;
    eye_left: Mesh;
  };
  materials: {
    ["Material.002"]: MeshStandardMaterial;
    Material: MeshStandardMaterial;
    ring_yellow: MeshStandardMaterial;
    ghost: MeshPhysicalMaterial;
    ["Material.001"]: MeshStandardMaterial;
  };
};

useGLTF.preload(GhostGlb);

export default function Ghost(props: GroupProps) {
  const { nodes, materials } = useGLTF(GhostGlb) as unknown as GLTFResult;

  return (
    <group name="Scene" {...props}>
      <mesh
        name="mouth"
        castShadow
        receiveShadow
        geometry={nodes.mouth.geometry}
        material={materials["Material.002"]}
        position={[0, -0.2, 0.79]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.09, 0.23, 0.02]}
      />
      <mesh
        name="eye_right"
        castShadow
        receiveShadow
        geometry={nodes.eye_right.geometry}
        material={materials.Material}
        position={[-0.25, 0.21, 0.62]}
        scale={0.16}
      />
      <mesh
        name="ring"
        castShadow
        receiveShadow
        geometry={nodes.ring.geometry}
        material={materials.ring_yellow}
        position={[0, 0.78, 0]}
      />
      <mesh name="body" castShadow receiveShadow geometry={nodes.body.geometry} material={materials.ghost} />
      <mesh
        name="eye_left"
        castShadow
        receiveShadow
        geometry={nodes.eye_left.geometry}
        material={materials["Material.001"]}
        position={[0.25, 0.21, 0.62]}
        scale={0.16}
      />
    </group>
  );
}

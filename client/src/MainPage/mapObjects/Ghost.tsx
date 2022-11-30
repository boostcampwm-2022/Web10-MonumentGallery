import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import GhostGlb from "../../assets/models/monument_ghost.glb?url";

type GLTFResult = GLTF & {
  nodes: {
    mouth: THREE.Mesh;
    eye_right: THREE.Mesh;
    ring: THREE.Mesh;
    body: THREE.Mesh;
    eye_left: THREE.Mesh;
  };
  materials: {
    ["Material.002"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
    ring_yellow: THREE.MeshStandardMaterial;
    ghost: THREE.MeshPhysicalMaterial;
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

type ActionName = "mouthAction" | "eye-rightAction" | "ringAction" | "bodyAction" | "eye-leftAction";
// type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Ghost(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(GhostGlb) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
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
          ㄴ
          scale={0.16}
        />
      </group>
    </group>
  );
}

useGLTF.preload(GhostGlb);

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import PortalGlb from "../../assets/models/portal.glb?url";
import { GroupProps } from "@react-three/fiber";
type GLTFResult = GLTF & {
  nodes: {
    Gate_Emission: THREE.Mesh;
    Plane006: THREE.Mesh;
    Plane007: THREE.Mesh;
    Plane008: THREE.Mesh;
    Plane002: THREE.Mesh;
    Plane004: THREE.Mesh;
    Plane: THREE.Mesh;
    Plane001: THREE.Mesh;
    Plane003: THREE.Mesh;
    Stone_Slab: THREE.Mesh;
    Cube001: THREE.Mesh;
    Cube003: THREE.Mesh;
    Cube004: THREE.Mesh;
    Cube005: THREE.Mesh;
    Cube002: THREE.Mesh;
    Cube006: THREE.Mesh;
    Cube007: THREE.Mesh;
    Cube008: THREE.Mesh;
    Cube009: THREE.Mesh;
    Cube010: THREE.Mesh;
    Cube011: THREE.Mesh;
    Cube012: THREE.Mesh;
    Cube013: THREE.Mesh;
    Cube014: THREE.Mesh;
    Cube015: THREE.Mesh;
    Cube016: THREE.Mesh;
    Cube017: THREE.Mesh;
    Cube018: THREE.Mesh;
    Cube019: THREE.Mesh;
  };
  materials: {
    ["Material.005"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshPhysicalMaterial;
  };
};

export function Portal(props: GroupProps) {
  const { nodes, materials } = useGLTF(PortalGlb) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Gate_Emission.geometry}
        material={materials["Material.005"]}
        position={[0, 0.09, -0.31]}
        scale={[0.97, 1, 0.04]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane006.geometry}
        material={materials["Material.002"]}
        position={[-1.71, 0.18, 0.32]}
        rotation={[3, 0.9, -2.9]}
        scale={0.79}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane007.geometry}
        material={materials["Material.002"]}
        position={[1.6, 0.21, -0.79]}
        rotation={[0.46, 0.38, -0.55]}
        scale={1.42}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane008.geometry}
        material={materials["Material.002"]}
        position={[2.14, -0.3, 1.31]}
        rotation={[2.44, 1.41, -1.87]}
        scale={0.79}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane002.geometry} material={materials["Material.003"]} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004.geometry}
        material={materials["Material.003"]}
        position={[0, -0.48, 0]}
        scale={[2.41, 1, 1.56]}
      />
      <mesh castShadow receiveShadow geometry={nodes.Plane.geometry} material={materials["Material.004"]} />
      <mesh castShadow receiveShadow geometry={nodes.Plane001.geometry} material={materials["Material.003"]} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003.geometry}
        material={materials.Material}
        position={[0, 0.92, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Stone_Slab.geometry}
        material={nodes.Stone_Slab.material}
        position={[1.32, 0.03, 0.57]}
        rotation={[Math.PI, -0.03, Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={nodes.Cube001.material}
        position={[-1.05, 0.02, -0.12]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={1.18}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={nodes.Cube003.material}
        position={[-0.17, 0.02, -0.19]}
        rotation={[0, 0.1, 0]}
        scale={1.3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        position={[-1.31, 0.02, 0.52]}
        rotation={[0, 0.3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        material={nodes.Cube005.material}
        position={[0.71, 0.01, -0.2]}
        scale={1.09}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry}
        material={nodes.Cube002.material}
        position={[-1.84, -0.46, 1.1]}
        rotation={[3.04, -0.02, -3.14]}
        scale={1.07}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube006.geometry}
        material={nodes.Cube006.material}
        position={[-1.03, -0.48, 1.13]}
        rotation={[0, 0.01, 0]}
        scale={1.07}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007.geometry}
        material={nodes.Cube007.material}
        position={[1.66, -0.48, 0.98]}
        rotation={[0.04, 0.47, 0.09]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008.geometry}
        material={nodes.Cube008.material}
        position={[-1.71, -0.44, 0.03]}
        rotation={[0.03, 0.02, 0.01]}
        scale={1.07}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009.geometry}
        material={nodes.Cube009.material}
        position={[-2.64, -0.7, -0.17]}
        rotation={[-0.12, -0.15, 0.45]}
        scale={1.34}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube010.geometry}
        material={nodes.Cube010.material}
        position={[1.82, -0.45, -0.27]}
        rotation={[Math.PI, -0.03, Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube011.geometry}
        material={nodes.Cube011.material}
        position={[1.97, -0.4, 0.19]}
        rotation={[Math.PI, -0.03, Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube012.geometry}
        material={nodes.Cube012.material}
        position={[0.34, -0.48, -0.97]}
        rotation={[0, 0.03, 0]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube013.geometry}
        material={nodes.Cube013.material}
        position={[-0.46, -0.48, -1.1]}
        rotation={[0, 0.03, 0]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014.geometry}
        material={nodes.Cube014.material}
        position={[-1.81, -0.21, -1.01]}
        rotation={[-0.11, -0.75, 0.66]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube015.geometry}
        material={nodes.Cube015.material}
        position={[0.28, 0.02, 0.27]}
        scale={1.09}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube016.geometry}
        material={nodes.Cube016.material}
        position={[1.83, -0.95, 1.79]}
        rotation={[-Math.PI, 0.84, -Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube017.geometry}
        material={nodes.Cube017.material}
        position={[2.41, -0.95, 1.53]}
        rotation={[Math.PI, -0.96, Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube018.geometry}
        material={nodes.Cube018.material}
        position={[-1.21, -0.95, 2.06]}
        rotation={[Math.PI, -0.63, Math.PI]}
        scale={1.14}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019.geometry}
        material={nodes.Cube019.material}
        position={[-1.69, -0.88, 1.96]}
        rotation={[0.02, 0.07, 0.16]}
        scale={1.14}
      />
    </group>
  );
}

useGLTF.preload(PortalGlb);

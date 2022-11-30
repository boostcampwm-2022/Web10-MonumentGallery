import * as THREE from "three";
import React, { useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import GhostGlb from "../../assets/models/monument_ghost.glb?url";
import { useFrame, useThree } from "@react-three/fiber";
import TPVCollisionPlayerBody from "../components/TPVCollisionPlayerBody";
import { Vector3Array } from "@react-three/rapier";

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

// type ActionName = "mouthAction" | "eye-rightAction" | "ringAction" | "bodyAction" | "eye-leftAction";
// type GLTFActions = Record<ActionName, THREE.AnimationAction>;

const DIRECTION = {
  IDLE: "IDLE",
  E: "East",
  SE: "SouthEast",
  S: "South",
  SW: "SouthWest",
  W: "West",
  NW: "NorthWest",
  N: "North",
  NE: "NorthEast",
} as const;

function Ghost({ ghostParent }: { ghostParent: THREE.Group | null }) {
  const { nodes, materials } = useGLTF(GhostGlb) as unknown as GLTFResult;
  const { camera } = useThree();
  const ghostRef = useRef<THREE.Group>(null);
  const [rotate, setRotate] = useState();
  const [position, setPosition] = useState<Vector3Array>([0, 0, 0]);

  function getDirection(directionVector: [x: number, z: number]) {
    const [x, z] = directionVector;
    if (x === 1 && z === -1) return DIRECTION.E;
    if (x === 1 && z === 0) return DIRECTION.SE;
    if (x === 1 && z === 1) return DIRECTION.S;
    if (x === 0 && z === 1) return DIRECTION.SW;
    if (x === -1 && z === 1) return DIRECTION.W;
    if (x === -1 && z === 0) return DIRECTION.NW;
    if (x === -1 && z === -1) return DIRECTION.N;
    if (x === 0 && z === -1) return DIRECTION.NE;
    return DIRECTION.IDLE;
  }

  function calDirection(prev: Vector3Array, next: Vector3Array): [x: number, z: number] {
    const [x, , z] = prev.map((e, i) => {
      const value: number = next[i] - e;
      if (Math.abs(value) < 0.01) return 0;
      return value < 0 ? -1 : 1;
    });
    return [x, z];
  }

  useFrame(({ clock }) => {
    if (!ghostParent) return;
    if (!ghostRef.current) return;
    camera.lookAt(ghostRef.current.position);
    const { x, y, z } = camera.position;
    const prevPosition = position;
    const newPosition: Vector3Array = [x - 10, y - 13, z - 10];
    const directionVector = calDirection(prevPosition, newPosition);
    const direction = getDirection(directionVector);
    setPosition(newPosition);
    // TODO: react-spring으로 바뀐 방향에 따라 애니메이션 넣어주기, 상태값으로 관리
    switch (direction) {
      case DIRECTION.IDLE:
        ghostRef.current.position.y += Math.sin(clock.getElapsedTime() * 5) * 0.004;
        return;
      case DIRECTION.E:
        ghostRef.current.rotateY(Math.PI);
        return;
      case DIRECTION.SE:
        return;
      case DIRECTION.S:
        return;
      case DIRECTION.SW:
        return;
      case DIRECTION.W:
        return;
      case DIRECTION.NW:
        return;
      case DIRECTION.N:
        return;
      case DIRECTION.NE:
        return;
      default:
        return;
    }
  });

  return (
    <>
      <TPVCollisionPlayerBody position={position} />
      <group position={position} ref={ghostRef} scale={[0.5, 0.5, 0.5]} dispose={null}>
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
            scale={0.16}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload(GhostGlb);

export default Ghost;

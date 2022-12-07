import { useEffect, useMemo } from "react";
import { Text, useGLTF } from "@react-three/drei";
import { animated, Interpolation } from "@react-spring/three";

import PortalGlb from "../../assets/models/portal.glb?url";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

import type { Mesh, MeshStandardMaterial, MeshPhysicalMaterial } from "three";
import type { GLTF } from "three-stdlib";
import type { Vector3 } from "@react-three/fiber";
import type { ITriggeredSpringState } from "../../@types/animator";

type GLTFResult = GLTF & {
  nodes: {
    Plane002_1: Mesh;
    Plane002_2: Mesh;
    Plane003_1: Mesh;
    Plane003_2: Mesh;
    Plane003_3: Mesh;
  };
  materials: {
    ["Material.003"]: MeshStandardMaterial;
    ["Material.002"]: MeshStandardMaterial;
    Material: MeshPhysicalMaterial;
    ["Material.004"]: MeshStandardMaterial;
  };
};

interface PortalProps {
  link: string;
  position: Vector3;
  animator: ITriggeredSpringState;
  collision: boolean;
}

function PortalMesh() {
  const { nodes, materials } = useGLTF(PortalGlb) as unknown as GLTFResult;

  return (
    <group dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Plane002_1.geometry} material={materials["Material.003"]} />
      <mesh castShadow receiveShadow geometry={nodes.Plane002_2.geometry} material={materials["Material.002"]} />
      <group position={[0, 0.92, 0]}>
        <mesh castShadow receiveShadow geometry={nodes.Plane003_2.geometry} material={materials["Material.004"]} />
        <mesh castShadow receiveShadow geometry={nodes.Plane003_3.geometry} material={materials["Material.003"]} />
      </group>
    </group>
  );
}

export default function Portal({ link, position, animator, collision }: PortalProps) {
  const { spring } = animator;
  const animatedScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [1, 1]), []);

  useEffect(() => {
    if (!collision) return;

    function onEnter(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      window.location.href = link;
    }
    document.addEventListener("keydown", onEnter);
    return () => document.removeEventListener("keydown", onEnter);
  }, [collision]);

  return (
    <group position={position}>
      <animated.mesh scale={animatedScale}>
        <PortalMesh />
      </animated.mesh>
      <Text
        font={MapoFlowerIsland}
        color="black"
        position={[0, 0, 2]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0, "YXZ"]}
        visible={collision}
      >
        Space를 눌러 입장하세요
      </Text>
    </group>
  );
}

useGLTF.preload(PortalGlb);

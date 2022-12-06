import * as THREE from "three";
import { Text, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import PortalGlb from "../../assets/models/portal.glb?url";
import { Vector3 } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import useTriggeredSpring from "../../hooks/useTriggeredSpring";
import { animated, Interpolation } from "@react-spring/three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import MapoFlowerIsland from "../../assets/fonts/MapoFlowerIsland.otf";

type GLTFResult = GLTF & {
  nodes: {
    Plane002_1: THREE.Mesh;
    Plane002_2: THREE.Mesh;
    Plane003_1: THREE.Mesh;
    Plane003_2: THREE.Mesh;
    Plane003_3: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
    Material: THREE.MeshPhysicalMaterial;
    ["Material.004"]: THREE.MeshStandardMaterial;
  };
};

interface PortalProps {
  link: string;
  position: Vector3;
  setTextRingVisible: (visible: boolean) => void;
}

export function Portal({ link, position, setTextRingVisible }: PortalProps) {
  const { nodes, materials } = useGLTF(PortalGlb) as unknown as GLTFResult;
  const [collision, setCollision] = useState(false);
  const { spring } = useTriggeredSpring(collision, { tension: 500, friction: 150, precision: 0.04 });
  const animatedScale: Interpolation<number, number> = useMemo(() => spring.to([0, 1], [0.5, 1]), []);

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
    <RigidBody
      type="fixed"
      position={position}
      colliders={false}
      onCollisionEnter={() => {
        setCollision(true);
        setTextRingVisible(true);
      }}
      onCollisionExit={() => {
        setCollision(false);
        setTextRingVisible(false);
      }}
    >
      <animated.mesh scale={animatedScale}>
        <group position={position} rotation={[0, Math.PI / 4, 0]} dispose={null}>
          <mesh castShadow receiveShadow geometry={nodes.Plane002_1.geometry} material={materials["Material.003"]} />
          <mesh castShadow receiveShadow geometry={nodes.Plane002_2.geometry} material={materials["Material.002"]} />
          <group position={[0, 0.92, 0]}>
            <mesh castShadow receiveShadow geometry={nodes.Plane003_2.geometry} material={materials["Material.004"]} />
            <mesh castShadow receiveShadow geometry={nodes.Plane003_3.geometry} material={materials["Material.003"]} />
          </group>
        </group>
      </animated.mesh>
      <CuboidCollider args={[1, 1, 1]} />

      {collision && (
        <Text
          font={MapoFlowerIsland}
          color="black"
          position={[2, 0, 2]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, Math.PI / 4, 0, "YXZ"]}
        >
          Space를 눌러 입장하세요
        </Text>
      )}
    </RigidBody>
  );
}

useGLTF.preload(PortalGlb);

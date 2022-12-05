import { useRef } from "react";
import { CapsuleCollider, RigidBody, RigidBodyApi, Vector3Array } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

export default function TPVCollisionPlayerBody({ position }: { position: Vector3Array }) {
  const ref = useRef<RigidBodyApi>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.setTranslation(new Vector3(camera.position.x - 10, 1, camera.position.z - 10));
  });
  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      lockTranslations
      position={position}
      enabledRotations={[false, false, false]}
    >
      {/* <mesh scale={[1, 1, 1]}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
